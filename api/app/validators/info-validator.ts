import * as Joi from 'joi';
import {CommonValidator} from "./common-validator";

export class InfoValidator extends CommonValidator {
    public getInfoQuery: Joi.ObjectSchema = Joi.object().keys({
        search: Joi.string().description("Search string used for lookup.").required()
    });

    public getInfoResponse: Joi.ArraySchema = Joi.array().items(Joi.object().keys({
        title: Joi.string(),
        score: Joi.number().min(0).max(10),
        type: Joi.string().allow("").allow(null),
        description: Joi.string().allow("").allow(null),
        image: Joi.string().allow("").allow(null)
    }));
}