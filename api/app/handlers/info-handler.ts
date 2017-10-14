import * as Wreck from 'wreck';
import * as Xml2js from 'xml2js';
import * as Hapi from 'hapi';
import {Config} from "../config";
import {ErrorResponse} from "../services/error-response";

export interface IInfoData {
    title: string,
    score: number,
    type: string,
    description: string,
    image: string
}

interface IInfoResponse {
    manga: {
        entry: {
            title: string,
            score: number,
            type: string[],
            synopsis: string[],
            image: string[]
        }[]
    }
}

export class InfoHandler {
    public static Self(instance: InfoHandler = new InfoHandler()): InfoHandler {
        return instance;
    }

    public getInfo (request: Hapi.Request, reply: Hapi.Base_Reply) {
        let query: {search: string} = request.query;

        Wreck.get(Config.info.url + "?q=" + encodeURIComponent(query.search), {
            headers: {
                "Authorization": "Basic " + Config.info.auth
            }
        }, (err, res, payload) => {
            if (!err) {
                let xml = payload.toString();

                if (xml.length > 0) {
                    Xml2js.parseString(xml, function (err: Error, result: IInfoResponse) {
                        if (!err) {
                            if (result && result.manga && result.manga.entry && Array.isArray(result.manga.entry) && result.manga.entry.length > 0) {
                                let info: IInfoData[] = [];

                                result.manga.entry.forEach((entry) => {
                                    info.push({
                                        title: entry.title[0],
                                        score: Number(entry.score),
                                        type: entry.type[0],
                                        description: entry.synopsis[0],
                                        image: entry.image[0]
                                    });
                                });

                                reply(info);
                            } else {
                                console.error("No entry found with given search string.");

                                ErrorResponse.GenerateResponse(reply);
                            }
                        } else {
                            console.error("Unable to parse xml string, error: " + err);

                            ErrorResponse.GenerateResponse(reply);
                        }
                    });
                } else {
                    console.error("Unable to parse empty xml string.");

                    ErrorResponse.GenerateResponse(reply);
                }
            } else {
                console.error("Unable to send request to info service.");

                ErrorResponse.GenerateResponse(reply, 503);
            }
        });
    }
}
