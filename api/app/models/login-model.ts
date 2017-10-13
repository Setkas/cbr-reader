import {Database} from "../services/database";

export interface ILoginResponse {
    id_user: number
}

export interface ILoginData {
    id_user: number,
    username: string,
    email: string
}

export class LoginModel {
    private tableName: string = "users";

    constructor(private database: Database = new Database()) {

    }

    public checkLogin(username: string, password: string): Promise<ILoginResponse> {
        return new Promise((resolve, reject) => {
            this.database.select("SELECT id_user FROM " + this.tableName + " WHERE username = ? AND password = ?;", [
                username,
                password
            ]).then((data: ILoginResponse[]) => {
                if (data.length > 0) {
                    resolve(data[0]);
                } else {
                    reject(null);
                }
            }, (err: Error) => {
                reject(err);
            });
        });
    }

    public getById(userId: number): Promise<ILoginData> {
        return new Promise((resolve, reject) => {
            let fields: string[] = [
                "id_user",
                "username",
                "email"
            ];

            this.database.select("SELECT " + fields.join(", ") + " FROM " + this.tableName + " WHERE id_user = ?;", [
                userId
            ]).then((data: ILoginData[]) => {
                if (data.length > 0) {
                    resolve(data[0]);
                } else {
                    reject(null);
                }
            }, (err: Error) => {
                reject(err);
            });
        });
    }

    public addUser(username: string, password: string, email: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.database.query("INSERT INTO " + this.tableName + " VALUES(NULL, ?, ?, ?);", [
                username,
                password,
                email
            ]).then(() => {
                resolve();
            }, (err: Error) => {
                reject(err);
            });
        });
    }
}
