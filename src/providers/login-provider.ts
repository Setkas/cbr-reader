import {Injectable, EventEmitter} from "@angular/core";
import {AppVariables} from "../app/variables";
import {LoggerProvider} from "./logger-provider";
import * as moment from "moment";
import {CookieService} from "ng2-cookies";
import {ModalProvider} from "../components/modal-component/modal-provider";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {LoaderProvider} from "../components/loader-component/loader-provider";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";

export interface LoginDetailsInterface {
  access: string,
  refresh: string
}

export interface UserDetailsInterface {
  username: string,
  id_user: number,
  email: string
}

@Injectable()
export class LoginProvider {
  public $onLogin: EventEmitter<void> = new EventEmitter<void>();

  public $onLogout: EventEmitter<void> = new EventEmitter<void>();

  public loginData: LoginDetailsInterface = null;

  public userDetails: UserDetailsInterface = null;

  private cookieKey: string = "session";

  constructor(private http: HttpClient,
              private cookie: CookieService,
              private modal: ModalProvider,
              private translate: TranslateService,
              private router: Router,
              private loader: LoaderProvider) {
    this.$onLogin.subscribe(() => {
      this.details().then((data: UserDetailsInterface) => {
        this.userDetails = data;
      }, () => {

      });
    })
  }

  public login(username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!(!username || username.length === 0 || !password || password.length === 0)) {
        this.http.post<LoginDetailsInterface>(AppVariables.apiUrl + "/login", {
          username: username,
          password: password
        }).subscribe((data: LoginDetailsInterface) => {
          this.loginData = data;

          this.saveSession(data, moment().add(1, 'day'));

          this.$onLogin.emit();

          resolve();
        }, (response: HttpErrorResponse) => {
          let data: any = response.error,
            message: string = data.message || data.error;

          reject(message);
        });
      } else {
        reject("NO_DATA");
      }
    });
  }

  public isLogin(): boolean {
    let session: LoginDetailsInterface = this.loadSession();

    if (session !== null) {
      this.loginData = session;

      this.$onLogin.emit();

      return true;
    }

    return false;
  }

  public logout(): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      this.removeSession();

      this.loginData = null;

      this.$onLogout.emit();

      resolve();
    });
  }

  public isAuthorized(): boolean {
    return this.loginData !== null && this.loginData.access.length > 0;
  }

  public addAuthorization(options: HttpHeaders = null): HttpHeaders {
    if (options === null) {
      options = new HttpHeaders();
    }

    if (this.isAuthorized()) {
      options = options.set("Authorization", this.loginData.access);
    }

    return options;
  }

  public handleError(errorCode: number, errorMessage: string): void {
    if ([401, 410, 500, 502, 503].indexOf(errorCode) >= 0) {
      this.logout().then(() => {
        this.modal.show({
          title: this.translate.instant("login.SERVICE_ERROR"),
          content: this.translate.instant("login.AUTOMATIC_LOGOUT") + "<br /><br />" + this.translate.instant("error." + errorMessage),
          closeOnClick: false,
          buttons: [
            {
              text: this.translate.instant("general.CLOSE"),
              callback: () => {
                this.loader.show();

                setTimeout(() => {
                  location.reload();
                });
              }
            }
          ]
        });

        this.router.navigate(["/login"]);
      });
    }
  }

  private saveSession(session: LoginDetailsInterface, expiration: moment.Moment): boolean {
    this.removeSession();

    this.cookie.set(AppVariables.cookiePrefix + this.cookieKey, JSON.stringify(session), expiration.toDate());

    return true;
  }

  private loadSession(): LoginDetailsInterface|null {
    if (this.cookie.check(AppVariables.cookiePrefix + this.cookieKey)) {
      try {
        let session: LoginDetailsInterface = JSON.parse(this.cookie.get(AppVariables.cookiePrefix + this.cookieKey));

        if (session.access.length > 0) {
          return session;
        } else {
          this.removeSession();

          return null;
        }
      } catch (e) {
        this.removeSession();

        return null;
      }
    } else {
      return null;
    }
  }

  private removeSession(): boolean {
    if (this.cookie.check(AppVariables.cookiePrefix + this.cookieKey)) {
      if (this.cookie.delete(AppVariables.cookiePrefix + this.cookieKey)) {
        LoggerProvider.Log("[LOGIN]: Removed active session data from storage");

        return true;
      }
    }

    return false;
  }

  public details(): Promise<UserDetailsInterface> {
    return new Promise((resolve, reject) => {
      this.http.get<UserDetailsInterface>(AppVariables.apiUrl + "/login/details", {
        headers: this.addAuthorization()
      }).subscribe((data: UserDetailsInterface) => {
        resolve(data);
      }, (response: HttpErrorResponse) => {
        let data: any = response.error,
          message: string = data.message || data.error;

        this.handleError(response.status, message);

        reject(message);
      });
    });
  }

  public register(username: string, password: string, email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!(!username || username.length === 0 || !password || password.length === 0 || !email || email.length === 0)) {
        this.http.post<void>(AppVariables.apiUrl + "/login", {
          username: username,
          password: password,
          email: email
        }).subscribe(() => {
          resolve();
        }, (response: HttpErrorResponse) => {
          let data: any = response.error,
            message: string = data.message || data.error;

          this.handleError(response.status, message);

          reject(message);
        });
      } else {
        reject("NO_DATA");
      }
    });
  }
}
