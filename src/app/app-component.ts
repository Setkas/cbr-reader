import {Component, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import * as moment from "moment";
import {Router, NavigationEnd} from "@angular/router";
import {AppRoutes, RoutesInterface} from "./routes";
import {LoggerProvider} from "../providers/logger-provider";
import {Title} from "@angular/platform-browser";
import {LoginProvider} from "../providers/login-provider";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: 'app-component.html',
  styleUrls: ['app-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  public static ShowMenu: boolean = false;

  constructor(private translate: TranslateService,
              private router: Router,
              private title: Title,
              private login: LoginProvider) {
    let defaultLang: string = 'en';

    translate.setDefaultLang(defaultLang);

    translate.use(defaultLang);

    moment.locale(defaultLang);

    this.setupRouter();

    this.setupEvents();
  }

  private setupEvents(): void {
    this.translate.onLangChange.subscribe(() => {
      this.title.setTitle(this.translate.instant("general.PAGE_TITLE"));
    });

    this.login.$onLogin.subscribe(() => {
      AppComponent.ShowMenu = true;
    });

    this.login.$onLogout.subscribe(() => {
      AppComponent.ShowMenu = false;
    });
  }

  private setupRouter(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        let index: number = null;

        AppRoutes.forEach((route: RoutesInterface, key: number) => {
          if ("/" + route.path === event.urlAfterRedirects) {
            index = key;
          }
        });

        if (index !== null) {
          if (typeof AppRoutes[index].authentication === 'string' || (typeof AppRoutes[index].authentication === 'boolean' && AppRoutes[index].authentication === true)) {
            if (!this.login.isAuthorized()) {
              let isLogin: boolean = this.login.isLogin();

              if (!isLogin) {
                LoggerProvider.Warning("[ROUTER]: Unable to authorize page access for '" + event.urlAfterRedirects + "'.");

                this.router.navigate(['/login']);
              } else {
                let sub: Subscription = this.login.$onLogin.subscribe(() => {
                  sub.unsubscribe();

                  if (!this.login.isAuthorized()) {
                    LoggerProvider.Warning("[ROUTER]: Unable to authorize page access for '" + event.urlAfterRedirects + "'.");

                    this.router.navigate(['/login']);
                  }
                });
              }
            }
          }
        } else {
          LoggerProvider.Error("[ROUTER]: Loaded route was not found.");

          this.router.navigate(['/page-not-found']);
        }
      }
    });
  }

  public canShowMenu(): boolean {
    return AppComponent.ShowMenu === true;
  }
}
