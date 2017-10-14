import * as Sqlite3 from 'sqlite3';
import * as Fs from 'fs';
import * as Path from 'path';
import {Tables} from '../database';
import {Config} from "../config";
import * as Md5 from "md5";

export interface ITable {
  [key: string]: {
    type: string,
    primaryKey?: boolean,
    autoIncrement?: boolean,
    null?: boolean,
    unique?: boolean,
    default?: any
  }
}

export interface ITableList {
  [key: string]: ITable
}

export class Database {
  private static Instance: Sqlite3.Database;

  private static Tables: ITableList = {};

  constructor(clear: boolean = false,
              callback: ((err: Error|null) => void)|null = null) {
    let databasePath: string = Path.dirname(Config.database.fileName);

    if (!Fs.existsSync(databasePath)) {
      Fs.mkdirSync(databasePath);
    }

    if (!Database.Instance) {
      if (clear) {
        this.clearDatabase().then(() => {
          this.createDatabase().then(() => {
            if (callback !== null) {
              callback(null);
            }
          }, (err: Error) => {
            if (callback !== null) {
              callback(err);
            }
          });
        }, (err: Error) => {
          callback(err);
        });
      } else {
        this.createDatabase().then(() => {
          if (callback !== null) {
            callback(null);
          }
        }, (err: Error) => {
          console.error(err);

          if (callback !== null) {
            callback(err);
          }
        });
      }
    } else {
      if (callback !== null) {
        callback(null);
      }
    }
  }

  private createDatabase(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Database.Instance = new Sqlite3.Database(Config.database.fileName, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          this.prepareTables(Tables).then(() => {
            Database.Tables = Tables;

            this.insertBaseData().then(() => {
              resolve();
            }, (err: Error) => {
              reject(err);
            });
          }, (err: Error) => {
            reject(err);
          });
        }
      });
    });
  }

  private prepareTables(tables: ITableList): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!tables) {
        reject("No tables defined");
      } else {
        let queries: string[] = [];

        for (let table in tables) {
          if (tables.hasOwnProperty(table)) {
            let query: string = "CREATE TABLE IF NOT EXISTS " + table,
              columns: string[] = [];

            for (let column in tables[table]) {
              if (tables[table].hasOwnProperty(column)) {
                let col: string = column + " " + tables[table][column].type.toUpperCase();

                col += (tables[table][column].primaryKey) ? " PRIMARY KEY" : "";

                col += (tables[table][column].autoIncrement) ? " AUTOINCREMENT" : "";

                col += (tables[table][column].unique) ? " UNIQUE" : "";

                col += (tables[table][column].null) ? "" : " NOT NULL";

                col += (tables[table][column].default) ? " DEFAULT " + (typeof tables[table][column].default === 'string' ? "\"" + tables[table][column].default + "\"" : tables[table][column].default) : "";

                columns.push(col);
              }
            }

            queries.push(query + "(" + columns.join(",") + ")");
          }
        }

        let promises: Promise<any>[] = [];

        queries.forEach((query) => {
          promises.push(this.query(query, []));
        });

        Promise.all(promises).then(() => {
          resolve();
        }, (err: Error) => {
          reject(err);
        });
      }
    });
  }

  private insertBaseData(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (err: Error) => void) => {
      let baseUser: {username: string, password: string, email: string};

      if (!Fs.existsSync(Config.baseUserFile)) {
        resolve();
      } else {
        let fileContents: string = "";

        try {
          fileContents = Fs.readFileSync(Config.baseUserFile).toString();

          Fs.unlinkSync(Config.baseUserFile);
        } catch (e) {
          reject(e.getMessages());
        }

        if (fileContents) {
          baseUser = JSON.parse(fileContents);

          this.select("SELECT username FROM users WHERE username=?", [
            baseUser.username.toLowerCase()
          ]).then((data: any[]) => {
            if(data.length === 0) {
              this.query("INSERT INTO users VALUES(NULL, ?, ?, ?);", [
                baseUser.username.toLowerCase(),
                Md5(baseUser.password),
                baseUser.email
              ]).then(() => {
                resolve();
              }, (err: Error) => {
                reject(err);
              });
            } else {
              resolve();
            }
          }, (err: Error) => {
            reject(err);
          });
        }
      }
    });
  }

  public query(query: string, params: any[]): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!Database.Instance) {
        reject("No instance active");
      } else {
        Database.Instance.run(query, params, function (err: Error) {
          if (err) {
            console.error(err);

            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
      }
    });
  }

  public select(query: string, params: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!Database.Instance) {
        reject("No instance active");
      } else {
        Database.Instance.all(query, params, function (err: Error, rows: any[]) {
          if (err) {
            console.error(err);

            reject(err);
          } else {
            resolve(rows);
          }
        });
      }
    });
  }

  private clearDatabase(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Fs.unlink(Config.database.fileName, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
