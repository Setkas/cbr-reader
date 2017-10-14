import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {FlashProvider} from "../../components/flash-component/flash-provider";
import {TranslateService} from "@ngx-translate/core";
import {BooksProvider, BookInterface} from "../../providers/books-provider";

export interface BookViewInterface extends BookInterface {
  image: string
}

@Component({
  selector: 'app-dashboard-page',
  templateUrl: 'dashboard-page.html',
  styleUrls: ['dashboard-page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardPage implements OnInit {
  public bookList: BookViewInterface[] = [];

  constructor(private flash: FlashProvider,
              private translate: TranslateService,
              private books: BooksProvider) {

  }

  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    this.books.list().then((data: BookInterface[]) => {
      this.bookList = [];

      this.loadImageR(JSON.parse(JSON.stringify(data)));
    }, () => {

    });
  }

  private loadImageR(data: BookInterface[]) {
    if (data.length > 0) {
      this.books.preview(data[0].id_book).then((image: string) => {
        let book: BookViewInterface = Object.assign({image: image}, data[0]);

        this.bookList.push(book);

        data.shift();

        if (data.length > 0) {
          this.loadImageR(data);
        }
      }, () => {
        data.shift();

        if (data.length > 0) {
          this.loadImageR(data);
        }
      });
    }
  }
}
