import * as Hapi from 'hapi';
import {BooksHandler} from "../handlers/books-handler";
import {BooksValidator} from "../validators/books-validator";

const handler = new BooksHandler(),
    validator = new BooksValidator();

export const BooksRoute: Hapi.RouteConfiguration[] = [
    {
        method: 'GET',
        path: '/books',
        config: {
            auth: 'jwt',
            handler: handler.getBooks,
            description: "Loads all books from library.",
            tags: ['api', 'books'],
            validate: {
                headers: validator.commonHeaders
            },
            response: {
                schema: validator.getBooksResponse
            }
        }
    }, {
        method: 'PUT',
        path: '/books',
        config: {
            auth: 'jwt',
            handler: handler.putBook,
            description: "Adds new book to library.",
            tags: ['api', 'books'],
            validate: {
                headers: validator.commonHeaders,
                payload: validator.putBooksPayload
            },
            response: {
                schema: validator.emptyResponse
            }
        }
    }, {
        method: 'PATCH',
        path: '/books/{id_book}',
        config: {
            auth: 'jwt',
            handler: handler.patchBook,
            description: "Updates book in library.",
            tags: ['api', 'books'],
            validate: {
                headers: validator.commonHeaders,
                payload: validator.patchBooksPayload,
                params: validator.patchBooksParams
            },
            response: {
                schema: validator.emptyResponse
            }
        }
    }, {
        method: 'GET',
        path: '/books/{id_book}',
        config: {
            auth: 'jwt',
            handler: handler.getBookById,
            description: "Gets single book from library.",
            tags: ['api', 'books'],
            validate: {
                headers: validator.commonHeaders,
                params: validator.getBooksByIdParams
            },
            response: {
                schema: validator.getBookByIdResponse
            }
        }
    }, {
        method: 'GET',
        path: '/books/preview/{id_book}',
        config: {
            auth: 'jwt',
            handler: handler.getBookPreview,
            description: "Gets single book preview from library file.",
            tags: ['api', 'books', 'preview'],
            validate: {
                headers: validator.commonHeaders,
                params: validator.getBooksPreviewParams
            },
            cache: {
                expiresIn: 30 * 1000,
                privacy: 'private'
            }
        }
    }, {
        method: 'GET',
        path: '/books/page/{id_book}',
        config: {
            auth: 'jwt',
            handler: handler.getBookPage,
            description: "Gets single book page from library file.",
            tags: ['api', 'books', 'page'],
            validate: {
                headers: validator.commonHeaders,
                params: validator.getBooksPageParams,
                query: validator.getBooksPageQuery
            },
            cache: {
                expiresIn: 30 * 60 * 1000,
                privacy: 'private'
            }
        }
    }
];