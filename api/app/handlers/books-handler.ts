import * as Mime from 'mime';
import * as Fs from 'fs';
import * as Hapi from 'hapi';
import * as Moment from 'moment';
import {ErrorResponse} from "../services/error-response";
import {ArchiveTool} from "../services/archive-tool";
import {Config} from "../config";
import {IBook, BooksModel, IBookUpdate} from "../models/books-model";

export interface IImageData {
    data: ArrayBuffer,
    mime: string
}

export class BooksHandler {
    public static Self(instance: BooksHandler = new BooksHandler()): BooksHandler {
        return instance;
    }

    constructor(private booksModel: BooksModel = new BooksModel()) {

    }

    public getBooks(request: Hapi.Request, reply: Hapi.Base_Reply): void {
        const self: BooksHandler = BooksHandler.Self(this);

        self.booksModel.getBooks().then((data: IBook[]) => {
            data.forEach((row: IBook) => {
                row.deleted = !!row.deleted;
            });

            reply(data);
        }, () => {
            ErrorResponse.GenerateResponse(reply);
        });
    }

    public putBook(request: Hapi.Request, reply: Hapi.Base_Reply): void {
        const self: BooksHandler = BooksHandler.Self(this);

        let payload: IBook = JSON.parse(JSON.stringify(request.payload));

        payload.added = Moment().utc().toISOString();

        self.booksModel.addBook(payload).then(() => {
            reply(null);
        }, () => {
            ErrorResponse.GenerateResponse(reply);
        });
    }

    public postBook(request: Hapi.Request, reply: Hapi.Base_Reply): void {
        const self: BooksHandler = BooksHandler.Self(this);

        let payload: IBook = JSON.parse(JSON.stringify(request.payload));

        payload.added = Moment().utc().toISOString();

        self.booksModel.addBook(payload).then(() => {
            reply(null);
        }, () => {
            ErrorResponse.GenerateResponse(reply);
        });
    }

    public patchBook(request: Hapi.Request, reply: Hapi.Base_Reply): void {
        const self: BooksHandler = BooksHandler.Self(this);

        let payload: IBookUpdate = JSON.parse(JSON.stringify(request.payload)),
            params: {id_book: number} = JSON.parse(JSON.stringify(request.params));

        self.booksModel.updateBook(params.id_book, payload).then(() => {
            reply(null);
        }, () => {
            ErrorResponse.GenerateResponse(reply);
        });
    }

    public getBookById(request: Hapi.Request, reply: Hapi.Base_Reply): void {
        const self: BooksHandler = BooksHandler.Self(this);

        let params: {id_book: number} = JSON.parse(JSON.stringify(request.params));

        self.booksModel.getBook(params.id_book).then((data: IBook) => {
            data.deleted = !!data.deleted;

            reply(data);
        }, (err) => {
            if (err === null) {
                ErrorResponse.GenerateResponse(reply, 404);
            } else {
                ErrorResponse.GenerateResponse(reply);
            }
        });
    }

    private getImageFile(bookId: number, pageNo: number): Promise<IImageData> {
        const self: BooksHandler = BooksHandler.Self(this);

        return new Promise((resolve, reject) => {
            self.booksModel.getBook(bookId).then((data: IBook) => {
                const at: ArchiveTool = new ArchiveTool();

                let list: string[]|boolean = at.listArchive(data.file_name);

                if (!list || !Array.isArray(list) || list.length === 0 || list.length < pageNo || pageNo <= 0) {
                    console.error("Invalid book page specified for book '" + bookId + "'.");

                    reject(400);
                } else {
                    let exists = Fs.existsSync(Config.books.temp + list[pageNo - 1]);

                    if (!exists) {
                        let files: string[]|boolean = at.getArchiveFiles(data.file_name, [list[pageNo - 1]]);

                        if (typeof files === 'boolean' || files.length === 0) {
                            reject();
                        } else {
                            self.getImageFileResponse(files[0], resolve, reject);
                        }
                    } else {
                        self.getImageFileResponse(Config.books.temp + list[pageNo - 1], resolve, reject);
                    }
                }
            }, (err) => {
                if (err === null) {
                    reject(404);
                } else {
                    reject();
                }
            });
        });
    };

    private getImageFileResponse(file: string, resolve: Function, reject: Function): void {
        const self: BooksHandler = BooksHandler.Self(this);

        Fs.readFile(file, (err, data) => {
            if (!err) {
                resolve({
                    data: data,
                    mime: Mime.lookup(file)
                });
            } else {
                console.error("Could not read file contents, error: " + JSON.stringify(err));

                reject();
            }
        });
    }

    public getBookPreview (request: Hapi.Request, reply: Hapi.Base_Reply) {
        const self: BooksHandler = BooksHandler.Self(this);

        let params: {id_book: number} = JSON.parse(JSON.stringify(request.params));

        self.getImageFile(params.id_book, 1).then((data: IImageData) => {
            reply(data.data).type(data.mime);
        }, (code) => {
            ErrorResponse.GenerateResponse(reply, code);
        });
    }

    public getBookPage (request: Hapi.Request, reply: Hapi.Base_Reply) {
        const self: BooksHandler = BooksHandler.Self(this);

        let params: {id_book: number} = JSON.parse(JSON.stringify(request.params)),
            query: {page: number} = request.query;

        self.getImageFile(params.id_book, query.page).then((data: IImageData) => {
            reply(data.data).type(data.mime);
        }, (code) => {
            ErrorResponse.GenerateResponse(reply, code);
        });
    }
}
