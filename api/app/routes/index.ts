import * as Hapi from 'hapi';
import {LoginRoute} from "./login-route";
import {BooksRoute} from "./books-route";
import {InfoRoute} from "./info-route";

let routes: Hapi.RouteConfiguration[] = [] as Hapi.RouteConfiguration[];

routes = routes.concat(
    LoginRoute,
    BooksRoute,
    InfoRoute
);

export const Routes: Hapi.RouteConfiguration[] = routes;