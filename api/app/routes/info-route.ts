import * as Hapi from 'hapi';
import {Config} from "../config";
import {InfoHandler} from "../handlers/info-handler";
import {InfoValidator} from "../validators/info-validator";

const handler = new InfoHandler(),
    validator = new InfoValidator();

export const InfoRoute: Hapi.RouteConfiguration[] = [
    {
        method: 'GET',
        path: '/info',
        config: {
            auth: 'jwt',
            handler: handler.getInfo,
            description: "Loads book info from " + Config.info.name + ".",
            tags: ['api', 'info'],
            validate: {
                headers: validator.commonHeaders,
                query: validator.getInfoQuery
            },
            response: {
                schema: validator.getInfoResponse
            }
        }
    }
];