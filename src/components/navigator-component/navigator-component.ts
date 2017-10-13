import {Component, ViewEncapsulation} from '@angular/core';
import {AppVariables} from "../../app/variables";
import * as moment from "moment";
import {LoaderProvider} from "../loader-component/loader-provider";
import {LoginProvider} from "../../providers/login-provider";
import {Router} from "@angular/router";

declare const location: Location;

@Component({
  selector: 'navigator-component',
  templateUrl: 'navigator-component.html',
  styleUrls: ['navigator-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavigatorComponent {
  public imageUrl: string = AppVariables.imageUrl;

  constructor(private loader: LoaderProvider,
              private login: LoginProvider,
              private router: Router) {
  }

  /**
   * Logout start action
   */
  public logout(): void {
    this.loader.show();

    this.login.logout().then(() => {
      this.loader.hide();

      this.router.navigate(['/login']);

      this.loader.show();

      setTimeout(() => {
        location.reload();
      });
    });
  }
}
