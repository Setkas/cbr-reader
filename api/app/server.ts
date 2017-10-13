import * as Hapi from 'hapi';
import * as Vision from 'vision';
import * as Inert from 'inert';
import * as HapiSwagger from 'hapi-swagger';
import * as Pack from '../package.json';
import * as HapiAuthJwt2 from 'hapi-auth-jwt2';
import {Routes} from './routes/';
import {Config} from './config';
import {Auth, ITokenData} from "./services/auth";
import {Database} from "./services/database";
import {LibraryManager} from "./services/library-manager";

class Server {
    private connectionOptions: Hapi.ServerConnectionOptions = {
        port: Config.server.port,
        host: Config.server.host,
        routes: {
            cors: {
                headers: Config.server.headers
            },
            timeout: {
                server: Config.server.timeout,
                socket: Config.server.socket
            },
            payload: {
                maxBytes: Config.server.requestSize
            }
        }
    };

    private pack: any = JSON.parse(JSON.stringify(Pack));

    constructor(callback: (server: any) => void,
                private server: any = new Hapi.Server()) {
        this.setupServer().then(() => {
            callback(this.server);
        }, (err: Error) => {
            console.error(err);
        });
    }

    private setupServer(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.server.connection(this.connectionOptions);

            this.server.register([
                Inert,
                Vision,
                {
                    register: HapiSwagger,
                    options: {
                        info: {
                            'title': this.pack['description'] + ' Documentation',
                            'version': this.pack['version']
                        }
                    }
                },
                HapiAuthJwt2
            ], (err: Error) => {
                if (err) {
                    reject(err);

                    console.error(err);
                } else {
                    let promises: Promise<any>[] = [
                        this.setAuthStrategy(),
                        this.setRoutes(),
                        this.setupDatabase(),
                        this.manageLibrary(),
                    ];

                    Promise.all(promises).then(() => {
                        this.server.start((err: Error) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    }, (err: Error) => {
                        reject(err);
                    });
                }
            });
        });
    }

    private setAuthStrategy(): Promise<void> {
        return new Promise<void>((resolve) => {

            this.server.auth.strategy('jwt', 'jwt', {
                key: Config.authentication.key,
                validateFunc: (decoded: ITokenData, request: Hapi.Request, callback: Function) => {
                    new Auth().validate(request, decoded).then(() => {
                        callback(null, true);
                    }, (err: Error) => {
                        console.error(err);

                        callback(null, false);
                    });
                }
            });

            this.server.auth.default('jwt');

            resolve();
        });
    }

    private setRoutes(): Promise<void> {
        return new Promise<void>((resolve) => {
            Routes.forEach((routeParams: Hapi.RouteConfiguration) => {
                this.server.route(routeParams);
            });

            resolve();
        });
    }

    private setupDatabase(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            new Database(Config.database.clean, (err: Error|null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    private manageLibrary(): Promise<void> {
        return new Promise<void>((resolve) => {
            new LibraryManager(() => {
                resolve();
            });
        });
    }
}

new Server((server: any): void => {
    console.log('Server running at: ' + server.info.uri + '.');
});