import * as Hapi from 'hapi';
import * as Boom from "boom";

export class ErrorResponse {
    private static Codes: {[key: string]: string} = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        405: "METHOD_NOT_ALLOWED",
        406: "NOT_ACCEPTABLE",
        408: "TIMEOUT",
        500: "BAD_IMPLEMENTATION",
        501: "NOT_IMPLEMENTED",
        503: "SERVER_UNAVAILABLE",
        504: "GATEWAY_TIMEOUT"
    };

    public static GenerateResponse(reply: Hapi.Base_Reply, code: number = 500, data: any = null): void {
        switch (code) {
            case 400:
                reply(Boom.badRequest(ErrorResponse.Codes[code], data));

                break;

            case 401:
                reply(Boom.unauthorized(ErrorResponse.Codes[code]));

                break;

            case 403:
                reply(Boom.forbidden(ErrorResponse.Codes[code], data));

                break;

            case 404:
                reply(Boom.notFound(ErrorResponse.Codes[code], data));

                break;

            case 405:
                reply(Boom.methodNotAllowed(ErrorResponse.Codes[code], data));

                break;

            case 406:
                reply(Boom.notAcceptable(ErrorResponse.Codes[code], data));

                break;

            case 408:
                reply(Boom.clientTimeout(ErrorResponse.Codes[code], data));

                break;

            case 501:
                reply(Boom.notImplemented(ErrorResponse.Codes[code], data));

                break;

            case 503:
                reply(Boom.serverUnavailable(ErrorResponse.Codes[code], data));

                break;

            case 504:
                reply(Boom.gatewayTimeout(ErrorResponse.Codes[code], data));

                break;

            default:
                reply(Boom.badImplementation(ErrorResponse.Codes[500], data));
        }
    };
}
