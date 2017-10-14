import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app-component';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {RouterModule} from "@angular/router";
import {Ng2BootstrapModule} from "ngx-bootstrap";
import {MomentModule} from "angular2-moment";
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {AppRoutes} from "./routes";
import {LoginPage} from '../pages/login-page/login-page';
import {NotFoundPage} from "../pages/not-found-page/not-found-page";
import {DashboardPage} from "../pages/dashboard-page/dashboard-page";
import {LoaderComponent} from "../components/loader-component/loader-component";
import {LoggerProvider} from "../providers/logger-provider";
import {LoginProvider} from "../providers/login-provider";
import {CookieService} from "ng2-cookies";
import {CookieConsentComponent} from "../components/cookie-consent-component/cookie-consent-component";
import {LoaderProvider} from "../components/loader-component/loader-provider";
import {ModalProvider} from "../components/modal-component/modal-provider";
import {ModalComponent} from "../components/modal-component/modal-component";
import {FlashProvider} from "../components/flash-component/flash-provider";
import {FlashComponent} from "../components/flash-component/flash-component";
import {SlideToggleComponent} from "../components/slide-toggle-component/slide-toggle-component";
import {FadeToggleComponent} from "../components/fade-toggle-component/fade-toggle-component";
import {ReplaceValuePipe} from "../pipes/replace-value-pipe";
import {NavigatorComponent} from "../components/navigator-component/navigator-component";
import {ConvertNumberPipe} from "../pipes/convert-number-pipe";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {BooksProvider} from "../providers/books-provider";

export function HttpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginPage,
    NotFoundPage,
    DashboardPage,
    LoaderComponent,
    CookieConsentComponent,
    ModalComponent,
    FlashComponent,
    SlideToggleComponent,
    FadeToggleComponent,
    ReplaceValuePipe,
    NavigatorComponent,
    ConvertNumberPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MomentModule,
    Ng2BootstrapModule.forRoot()
  ],
  providers: [
    LoggerProvider,
    LoaderProvider,
    LoginProvider,
    CookieService,
    ModalProvider,
    FlashProvider,
    ReplaceValuePipe,
    ConvertNumberPipe,
    BooksProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
