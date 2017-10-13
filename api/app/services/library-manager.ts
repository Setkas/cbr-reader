import * as Schedule from 'node-schedule';
import * as Fs from 'fs';
import {Config} from "../config";
import {ArchiveTool} from "./archive-tool";
import {BooksModel, IBook} from "../models/books-model";
import * as Moment from 'moment';

export class LibraryManager {
    constructor(callback: (() => void)|null = null,
                private booksModel: BooksModel = new BooksModel()) {
        Schedule.scheduleJob({
            hour: 3,
            minute: 0,
            second: 0
        }, () => {
            LibraryManager.CheckDynamicFolders();

            this.clearTemp();

            this.checkLibrary();
        });

        LibraryManager.CheckDynamicFolders();

        this.clearTemp();

        this.checkLibrary();

        if (callback !== null) {
            callback();
        }
    }

    private static CheckDynamicFolders(): void {
        if (!Fs.existsSync(Config.books.temp)) {
            Fs.mkdirSync(Config.books.temp);
        }

        if (!Fs.existsSync(Config.books.folder)) {
            Fs.mkdirSync(Config.books.folder);
        }
    }

    public checkLibrary(): void {
        this.booksModel.getBooks().then((databaseBooks) => {
            let files: string[] = Fs.readdirSync(Config.books.folder),
                fileBooks: string[] = [];

            files.forEach((file: string) => {
                let extension: string|null = ArchiveTool.GetExtension(file) || ".";

                if (Config.books.extensions[extension]) {
                    fileBooks.push(file);
                }
            });

            this.checkFiles(fileBooks);

            this.checkDatabase(databaseBooks, fileBooks);

            this.insertBooks(fileBooks);
        }, (err: Error) => {
            console.error(err);
        });
    }

    public checkFiles(files: string[] = []): void {
        let deleteFiles: string[] = [];

        files.forEach((file: string) => {
            let list: string[]|boolean = new ArchiveTool().listArchive(file);


            if (!list || (typeof list !== 'boolean' && list.length === 0)) {
                deleteFiles.push(file);
            }
        });

        deleteFiles.forEach((deleteFile: string) => {
            files.splice(files.indexOf(deleteFile), 1);
        });
    }

    public checkDatabase(books: IBook[] = [], files: string[] = []): void {
        let deleteFiles: string[] = [];

        books.forEach((book: IBook) => {
            if (files.indexOf(book.file_name) >= 0) {
                deleteFiles.push(book.file_name);
            } else {
                this.booksModel.updateBook(book.id_book, {
                    deleted: true
                }).then(() => {

                }, (err: Error) => {
                    console.error(err);
                });
            }
        });

        deleteFiles.forEach((deleteFile: string) => {
            files.splice(files.indexOf(deleteFile), 1);
        });
    }

    private insertBooks(files: string[]): void {
        files.forEach((file: string) => {
            let extension: string|null = ArchiveTool.GetExtension(file) || ".",
                name: string = (extension && file) ? file.replace(extension, "") : file,
                list: string[]|boolean = new ArchiveTool().listArchive(file);

            name = name.replace("_", " ");

            if (list && typeof list !== 'boolean' && list.length !== 0) {
                this.booksModel.addBook({
                    id_book: 0,
                    pages: list.length,
                    score: 0,
                    type: "book",
                    added: Moment().utc().toISOString(),
                    description: "",
                    title: name,
                    file_name: file
                }).then(() => {

                }, (err: Error) => {
                    console.error(err);
                });
            }
        });
    };

    private clearTemp(dirPath: string = Config.books.temp): void {
        let files: string[] = [];

        try {
            files = Fs.readdirSync(dirPath);
        } catch (e) {
            console.error("Unable to clear temp folder, error: " + JSON.stringify(e));

            return;
        }

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let filePath: string = dirPath + '/' + files[i];

                if (Fs.statSync(filePath).isFile()) {
                    Fs.unlinkSync(filePath);
                } else {
                    this.clearTemp(filePath);
                }
            }
        }

        Fs.rmdirSync(dirPath);
    };
}