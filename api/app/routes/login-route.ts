import * as Hapi from 'hapi';
import {LoginHandler} from "../handlers/login-handler";
import {LoginValidator} from "../validators/login-validator";

const handler = new LoginHandler(),
    validator = new LoginValidator();

export const LoginRoute: Hapi.RouteConfiguration[] = [
    {
        method: 'POST',
        path: '/login',
        config: {
            auth: false,
            handler: handler.postLogin,
            description: "Login user with credentials.",
            tags: ['api', 'login'],
            validate: {
                payload: validator.postLoginPayload
            },
            response: {
                schema: validator.postLoginResponse
            }
        }
    }, {
        method: 'POST',
        path: '/login/refresh',
        config: {
            auth: false,
            handler: handler.postRefresh,
            description: "Refresh user instance by refresh token.",
            tags: ['api', 'login', 'refresh'],
            validate: {
                payload: validator.postRefreshPayload
            },
            response: {
                schema: validator.postRefreshResponse
            }
        }
    }, {
        method: 'POST',
        path: '/login/register',
        config: {
            auth: false,
            handler: handler.postRegister,
            description: "Register new user to system.",
            tags: ['api', 'login', 'register'],
            validate: {
                payload: validator.postRegisterPayload
            },
            response: {
                schema: validator.emptyResponse
            }
        }
    }, {
        method: 'GET',
        path: '/login/details',
        config: {
            auth: 'jwt',
            handler: handler.getDetails,
            description: "Get user details of logged in user.",
            tags: ['api', 'login', 'details'],
            validate: {
                headers: validator.commonHeaders
            },
            response: {
                schema: validator.getDetails
            }
        }
    }
];
