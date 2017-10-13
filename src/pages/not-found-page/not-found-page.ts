import {Component, ViewEncapsulation, OnDestroy, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {LoginProvider} from "../../providers/login-provider";

@Component({
  selector: 'app-not-found-page',
  templateUrl: 'not-found-page.html',
  styleUrls: ['not-found-page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotFoundPage implements OnInit, OnDestroy {
  constructor(private location: Location,
              private login: LoginProvider) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.login.isAuthorized()) {

    }
  }

  public goBack(): void {
    this.location.back();
  }
}
