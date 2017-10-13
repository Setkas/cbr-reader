import {Injectable} from "@angular/core";
import {AppVariables} from "../app/variables";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {LoginProvider} from "./login-provider";

export interface BookInterface {
  id_book: number,
  title: string,
  pages: number,
  score: number,
  type: number,
  added: string,
  description: string,
  file_name: string,
  deleted: boolean
}

export interface BookUpdateInterface {
  title?: string,
  pages?: number,
  score?: number,
  type?: number,
  description?: string,
  file_name?: string,
  deleted?: boolean
}

@Injectable()
export class BooksProvider {
  constructor(private http: HttpClient,
              private login: LoginProvider) {

  }

  public list(): Promise<BookInterface[]> {
    return new Promise((resolve, reject) => {
      this.http.get<BookInterface[]>(AppVariables.apiUrl + "/books", {
        headers: this.login.addAuthorization()
      }).subscribe((data: BookInterface[]) => {
        resolve(data);
      }, (response: HttpErrorResponse) => {
        let data: any = response.error,
          message: string = data.message || data.error;

        this.login.handleError(response.status, message);

        reject(message);
      });
    });
  }

  public single(bookId: number): Promise<BookInterface> {
    return new Promise((resolve, reject) => {
      this.http.get<BookInterface>(AppVariables.apiUrl + "/books/" + encodeURIComponent(bookId.toString()), {
        headers: this.login.addAuthorization()
      }).subscribe((data: BookInterface) => {
        resolve(data);
      }, (response: HttpErrorResponse) => {
        let data: any = response.error,
          message: string = data.message || data.error;

        this.login.handleError(response.status, message);

        reject(message);
      });
    });
  }

  public preview(bookId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      let req = new XMLHttpRequest(),
        header: HttpHeaders = this.login.addAuthorization();;

      req.open('get', AppVariables.apiUrl + "/books/preview/" + encodeURIComponent(bookId.toString()));

      req.responseType = "arraybuffer";

      req.setRequestHeader("Authorization", header.get("Authorization"));

      req.onreadystatechange = () => {
        if (req.readyState == 4 && req.status == 200) {
          /*let b64Response = btoa(req.response);

          console.log(req.response);*/

          resolve(req.response);
        } else {
          let data: any = req.response,
            message: string = (data) ? data.message : req.statusText;

          this.login.handleError(req.status, message);

          reject(message);
        }
      };

      req.send();
    });
  }

  public page(bookId: number, page: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get<string>(AppVariables.apiUrl + "/books/preview/" + encodeURIComponent(bookId.toString()) + "?page=" + encodeURIComponent(page.toString()), {
        headers: this.login.addAuthorization()
      }).subscribe((data: string) => {
        resolve(data);
      }, (response: HttpErrorResponse) => {
        let data: any = response.error,
          message: string = data.message || data.error;

        this.login.handleError(response.status, message);

        reject(message);
      });
    });
  }

  public update(bookId: number, data: BookUpdateInterface): Promise<BookInterface> {
    return new Promise((resolve, reject) => {
      this.http.patch<void>(AppVariables.apiUrl + "/books/" + encodeURIComponent(bookId.toString()), data, {
        headers: this.login.addAuthorization()
      }).subscribe(() => {
        resolve();
      }, (response: HttpErrorResponse) => {
        let data: any = response.error,
          message: string = data.message || data.error;

        this.login.handleError(response.status, message);

        reject(message);
      });
    });
  }
}
