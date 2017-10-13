import * as Joi from 'joi';

export class CommonValidator {
    public commonHeaders: Joi.ObjectSchema = Joi.object().keys({
        "authorization": Joi.string().description("Authorization JWT token.").required()
    }).unknown();

    public emptyResponse: Joi.StringSchema = Joi.string().allow("").allow(null).description("No content");
}
