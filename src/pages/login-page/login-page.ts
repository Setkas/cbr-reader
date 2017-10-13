import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {LoginProvider} from "../../providers/login-provider";
import {AppVariables} from "../../app/variables";
import {Router} from "@angular/router";
import {LoaderProvider} from "../../components/loader-component/loader-provider";
import {ModalProvider} from "../../components/modal-component/modal-provider";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-login-page',
  templateUrl: 'login-page.html',
  styleUrls: ['login-page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {
  public imageUrl: string = AppVariables.imageUrl;

  public appVersion: string = AppVariables.version;

  public formData: {Username: string, Password: string} = {
    Username: "",
    Password: ""
  };

  constructor(private login: LoginProvider,
              private loader: LoaderProvider,
              private router: Router,
              private modal: ModalProvider,
              private translate: TranslateService) {
  }

  ngOnInit() {
    if (this.login.isAuthorized()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.login.$onLogin.subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }

  public processLogin(): void {
    this.loader.show();

    this.login.login(this.formData.Username, this.formData.Password).then(() => {
      this.loader.hide();

      this.formData.Username = "";

      this.formData.Password = "";
    }, (error: string = "NETWORK_ERROR") => {
      this.formData.Password = "";

      this.modal.show({
        title: this.translate.instant("login.LOGIN_ERROR"),
        content: this.translate.instant("error." + error),
        className: "modal-sm text-center",
        buttons: [
          {
            text: this.translate.instant("general.CLOSE")
          }
        ]
      });

      this.loader.hide();
    });
  }
}
