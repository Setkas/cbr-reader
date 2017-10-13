import {Database} from "../services/database";

export interface IBook {
    id_book: number,
    title: string,
    pages: number,
    score: number,
    type: string,
    added: string,
    description: string,
    file_name: string,
    deleted?: boolean|number
}

export interface IBookUpdate {
    [index: string]: string|boolean|number
}

export class BooksModel {
    private tableName: string = "books";

    constructor(private database: Database = new Database()) {

    }

    public getBooks(): Promise<IBook[]> {
        return new Promise((resolve, reject) => {
            let fields: string[] = [
                'id_book',
                'title',
                'pages',
                'score',
                'type',
                'added',
                'description',
                'file_name',
                'deleted'
            ];

            this.database.select("SELECT " + fields.join(", ") + " FROM " + this.tableName + " WHERE deleted = ?;", [
                0
            ]).then((data: IBook[]) => {
                resolve(data);
            }, (err: Error) => {
                reject(err);
            });
        });
    }

    public getBook(bookId: number): Promise<IBook> {
        return new Promise((resolve, reject) => {
            let fields: string[] = [
                'id_book',
                'title',
                'pages',
                'score',
                'type',
                'added',
                'description',
                'file_name',
                'deleted'
            ];

            this.database.select("SELECT " + fields.join(", ") + " FROM " + this.tableName + " WHERE deleted = ? AND id_book = ?;", [
                0,
                bookId
            ]).then((data: IBook[]) => {
                if (data.length === 0) {
                    reject(null);
                } else {
                    resolve(data[0]);
                }
            }, (err: Error) => {
                reject(err);
            });
        });
    }

    public addBook(data: IBook): Promise<void> {
        let insertData: any[] = [
            data.title,
            data.pages,
            data.score,
            data.type,
            data.added,
            data.description,
            data.file_name
        ];

        return new Promise((resolve, reject) => {
            let query = "INSERT INTO " + this.tableName + " VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, 0);";

            this.database.query(query, insertData).then(() => {
                resolve();
            }, (err) => {
                reject(err);
            });
        });
    }

    public updateBook(id_book: number, data: IBookUpdate): Promise<void> {
        let updateData: (string|boolean|number)[] = [],
            fields: string[] = Object.keys(data);

        for (let value in data) {
            if (data.hasOwnProperty(value)) {
                if (value === 'deleted') {
                    updateData.push(!!data[value]);
                } else {
                    updateData.push(data[value]);
                }
            }
        }

        return new Promise((resolve, reject) => {
            if (fields.length === 1) {
                fields[0] += " = ?";
            }

            if (fields.length === 0) {
                resolve();
            } else {
                let query: string = "UPDATE " + this.tableName + " SET " + fields.join(" = ?, ") + " WHERE id_book = ?;";

                updateData.push(id_book);

                this.database.query(query, updateData).then(() => {
                    resolve();
                }, (err) => {
                    reject(err);
                });
            }
        });
    }
}