import * as Joi from 'joi';
import {CommonValidator} from "./common-validator";

export class BooksValidator extends CommonValidator {
    public id_book: Joi.NumberSchema = Joi.number().integer().min(0).description("Book's unique identification.");

    public title: Joi.StringSchema = Joi.string();

    public pages: Joi.NumberSchema = Joi.number().integer().positive();

    public score: Joi.NumberSchema = Joi.number().min(0).max(10);

    public type: Joi.NumberSchema = Joi.number().integer().min(0);

    public added: Joi.StringSchema = Joi.string().isoDate();

    public description: Joi.StringSchema = Joi.string().allow("").allow(null);

    public file_name: Joi.StringSchema = Joi.string();

    public deleted: Joi.BooleanSchema = Joi.boolean();

    public getBookByIdResponse: Joi.ObjectSchema = Joi.object().keys({
        id_book: this.id_book,
        title: this.title,
        pages: this.pages,
        score: this.score,
        type: this.type,
        added: this.added,
        description: this.description,
        file_name: this.file_name,
        deleted: this.deleted
    });

    public getBooksResponse: Joi.ArraySchema = Joi.array().items(this.getBookByIdResponse);

    public putBooksPayload: Joi.ObjectSchema = Joi.object().keys({
        title: this.title.required(),
        pages: this.pages.required(),
        score: this.score.required(),
        type: this.type.required(),
        description: this.description,
        file_name: this.file_name.required()
    });

    public patchBooksPayload: Joi.ObjectSchema = Joi.object().keys({
        title: this.title,
        pages: this.pages,
        score: this.score,
        type: this.type,
        description: this.description,
        file_name: this.file_name,
        deleted: this.deleted
    });

    public patchBooksParams: Joi.ObjectSchema = Joi.object().keys({
        id_book: this.id_book.required()
    });

    public getBooksByIdParams: Joi.ObjectSchema = Joi.object().keys({
        id_book: this.id_book.required()
    });

    public getBooksPreviewParams: Joi.ObjectSchema = Joi.object().keys({
        id_book: this.id_book.required()
    });

    public getBooksPageParams: Joi.ObjectSchema = Joi.object().keys({
        id_book: this.id_book.required()
    });

    public getBooksPageQuery: Joi.ObjectSchema = Joi.object().keys({
        page: Joi.number().integer().min(0).description("Number of requested page.").required()
    });
}
