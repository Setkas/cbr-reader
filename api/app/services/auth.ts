import * as Jwt2 from 'jsonwebtoken';
import * as Hapi from 'hapi';
import {Config} from "../config";
import {LoginModel} from "../models/login-model";

export interface ITokenData {
    id_user: number
}

export class Auth {
    constructor(private loginModel: LoginModel = new LoginModel()) {

    }

    public validate(request: Hapi.Request, data: ITokenData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let userId: number = data.id_user;

            this.loginModel.getById(userId).then(() => {
                request.params['id_user'] = userId.toString();

                resolve();
            }, (err) => {
                reject(err);
            });
        });
    }

    public decipher(token: string, key: string = Config.authentication.key): Promise<ITokenData> {
        return new Promise((resolve, reject) => {
            Jwt2.verify(token, key, function (err: Error, decoded: ITokenData) {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    public create(data: ITokenData, key = Config.authentication.key, expires = Config.authentication.expire): Promise<string> {
        return new Promise((resolve, reject) => {
            Jwt2.sign(data, key, {
                expiresIn: expires + 'd'
            }, function (err: Error, token: string) {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }
}
