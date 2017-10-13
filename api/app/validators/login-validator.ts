import * as Joi from 'joi';
import {CommonValidator} from "./common-validator";

export class LoginValidator extends CommonValidator {
    public id_user: Joi.NumberSchema = Joi.number().integer().min(0).description("Unique index of user.");

    public username: Joi.StringSchema = Joi.string().alphanum().min(3).max(30).description("Unique user name.");

    public password: Joi.StringSchema = Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).description("Password for user.");

    public email: Joi.StringSchema = Joi.string().email().description("User's email address.");

    public token: Joi.StringSchema = Joi.string().description("JWT authorization token.");

    public postLoginPayload: Joi.ObjectSchema = Joi.object().keys({
        "username": this.username.required(),
        "password": this.password.required()
    });

    public postLoginResponse: Joi.ObjectSchema = Joi.object().keys({
        "access": this.token,
        "refresh": this.token
    });

    public postRefreshPayload: Joi.ObjectSchema = Joi.object().keys({
        "token": this.token.required()
    });

    public postRefreshResponse: Joi.ObjectSchema = this.postLoginResponse;

    public postRegisterPayload: Joi.ObjectSchema = Joi.object().keys({
        "username": this.username.required(),
        "password": this.password.required(),
        "email": this.email.required()
    });

    public getDetails: Joi.ObjectSchema = Joi.object().keys({
        "username": this.username,
        "id_user": this.id_user,
        "email": this.email
    });
}