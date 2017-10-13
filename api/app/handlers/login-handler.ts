import * as Hapi from 'hapi';
import {LoginModel, ILoginData} from "../models/login-model";
import {Auth, ITokenData} from "../services/auth";
import {Config} from "../config";
import {ErrorResponse} from "../services/error-response";

export class LoginHandler {
    constructor(private auth: Auth = new Auth(),
                private loginModel: LoginModel = new LoginModel()) {

    }

    public postLogin(request: Hapi.Request, reply: Hapi.Base_Reply): void {
        let payload: {username: string, password: string} = JSON.parse(JSON.stringify(request.payload));

        this.loginModel.checkLogin(payload.username.toLowerCase(), payload.password).then((userData: ILoginData) => {
            this.auth.create({
                id_user: userData.id_user
            }).then((accessToken: string) => {
                this.auth.create({
                    id_user: userData.id_user
                }, Config.authentication.refreshKey, Config.authentication.refreshExpire).then((refreshToken: string) => {
                    reply({
                        access: accessToken,
                        refresh: refreshToken
                    });
                }, () => {
                    ErrorResponse.GenerateResponse(reply);
                });
            }, () => {
                ErrorResponse.GenerateResponse(reply);
            });
        }, (err: Error) => {
            if (err === null) {
                ErrorResponse.GenerateResponse(reply, 404);
            } else {
                ErrorResponse.GenerateResponse(reply, 401);
            }
        });
    }

    public postRefresh(request: Hapi.Request, reply: Hapi.Base_Reply): void {
        let payload: {token: string} = JSON.parse(JSON.stringify(request.payload));

        this.auth.decipher(payload.token, Config.authentication.refreshKey).then((data: ITokenData) => {
            this.loginModel.getById(data.id_user).then(() => {
                this.auth.create({
                    id_user: data.id_user
                }).then((accessToken: string) => {
                    this.auth.create({
                        id_user: data.id_user
                    }, Config.authentication.refreshKey, Config.authentication.refreshExpire).then((refreshToken: string) => {
                        reply({
                            access: accessToken,
                            refresh: refreshToken
                        });
                    }, () => {
                        ErrorResponse.GenerateResponse(reply);
                    });
                }, () => {
                    ErrorResponse.GenerateResponse(reply);
                });
            }, (err) => {
                if (err === null) {
                    ErrorResponse.GenerateResponse(reply, 404);
                } else {
                    ErrorResponse.GenerateResponse(reply, 401);
                }
            });
        }, () => {
            ErrorResponse.GenerateResponse(reply, 400);
        });
    }

    public postRegister(request: Hapi.Request, reply: Hapi.Base_Reply): void {
        let payload: {username: string, password: string, email: string} = JSON.parse(JSON.stringify(request.payload));

        this.loginModel.addUser(payload.username.toLowerCase(), payload.password, payload.email).then(() => {
            reply(null);
        }, () => {
            ErrorResponse.GenerateResponse(reply);
        });
    }

    public getDetails(request: Hapi.Request, reply: Hapi.Base_Reply): void {
        let userId: number = Number(request.params['id_user']);

        this.loginModel.getById(userId).then((userData) => {
            reply(userData);
        }, (err) => {
            if (err === null) {
                ErrorResponse.GenerateResponse(reply, 404);
            } else {
                ErrorResponse.GenerateResponse(reply);
            }
        });
    }
}