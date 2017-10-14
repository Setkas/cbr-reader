export interface IConfig {
    server: {
        host: string,
        port: number,
        headers: string[],
        timeout: number,
        socket: boolean,
        requestSize: number
    },
    authentication: {
        key: string,
        expire: number,
        refreshKey: string,
        refreshExpire: number
    },
    database: {
        fileName: string,
        clean: boolean
    },
    books: {
        folder: string,
        extensions: {
            [key: string]: string
        },
        temp: string
    },
    info: {
        name: string,
        url: string,
        auth: string
    },
    baseUserFile: string
}

export const Config: IConfig = {
    "server": {
        "host": "localhost",
        "port": 3030,
        "headers": [
            "Accept",
            "Authorization",
            "Content-Type",
            "If-None-Match"
        ],
        "timeout": 30000,
        "socket": false,
        "requestSize": 5242880
    },
    "authentication": {
        "key": "Uw2qqfgXc61KrHTmYk5I",
        "expire": 1,
        "refreshKey": "6UM9wQ3gGvOwPwiUSinI",
        "refreshExpire": 30
    },
    "database": {
        "fileName": "./build/data/sqlite.db",
        "clean": false
    },
    "books": {
        "folder": "./build/books/",
        "extensions": {
            ".cbr": "zip",
            ".cbz": "zip",
            ".zip": "zip"
        },
        "temp": "./build/temp/"
    },
    "info": {
        "name": "myanimelist.net",
        "url": "https://myanimelist.net/api/manga/search.xml",
        "auth": "U3ViZHJhZ29uOldpbmRvd3M3"
    },
    "baseUserFile": "./build/credentials.json"
};
