import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {CookieService} from "ng2-cookies";
import {AppVariables} from "../../app/variables";
import {LoginProvider} from "../../providers/login-provider";

@Component({
  selector: 'cookie-consent-component',
  templateUrl: 'cookie-consent-component.html',
  styleUrls: ['cookie-consent-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CookieConsentComponent implements OnInit {
  /**
   * Cookie storage name
   * @type {string}
   */
  private cookieKey: string = AppVariables.cookiePrefix + "consent";

  /**
   * indicates whether user agreed
   * @type {boolean}
   */
  public consent: boolean = false;

  /**
   * Constructor
   * @param cookie
   * @param login
   */
  constructor(private cookie: CookieService,
              private login: LoginProvider) {
    login.$onLogin.subscribe(() => {
      if (this.consent === false) {
        this.consentToPolicy();
      }
    });
  }

  /**
   * DOM ready event callback
   */
  ngOnInit() {
    if (this.cookie.check(this.cookieKey)) {
      let cookieContent: any = JSON.parse(this.cookie.get(this.cookieKey));

      if (cookieContent.value === true && cookieContent.version === AppVariables.version) {
        this.consent = true;
      }
    }
  }

  /**
   * Template variable access
   * @return {boolean}
   */
  public hasConsent(): boolean {
    return this.consent === true;
  }

  /**
   * User gave a consent to use cookies
   */
  public consentToPolicy(): void {
    this.consent = true;

    this.cookie.set(this.cookieKey, JSON.stringify({
      value: true,
      version: AppVariables.version
    }));
  }
}
