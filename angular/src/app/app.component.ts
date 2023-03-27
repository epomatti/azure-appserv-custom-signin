import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PublicClientApplication, Configuration } from "@azure/msal-browser";
import { environment } from '../environments/environment';

const MSAL_CONFIG: Configuration = {
  auth: {
    clientId: environment.AZUREAD_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${environment.AZUREAD_TENANT_ID}`
  }
};

const loginRequest = {
  scopes: [`api://${environment.AZUREAD_CLIENT_ID}/user_impersonation`]
};

const APPSERV_ENDPOINT = environment.APPSERV_ENDPOINT_URL

const clientapp = new PublicClientApplication(MSAL_CONFIG);

type AppServiceAuthResponse = {
  authenticationToken?: string,
  user?: {
    userId?: string;
  }
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'appservng';

  appServiceAuthResponse!: AppServiceAuthResponse;
  accessToken?: string = "";
  appServAuthorizationToken?: string = "";
  protectedData?: string = ""

  constructor(
    private http: HttpClient
  ) {
    clientapp.handleRedirectPromise().then((resp) => {
      if (resp !== null) {
        this.accessToken = resp.accessToken;
      }
    }).catch(err => {
      console.error(err);
    });
  }

  login() {
    clientapp.loginRedirect(loginRequest)
  }

  exchangeAccessToken() {
    const body = { "access_token": this.accessToken }
    this.http.post(`${APPSERV_ENDPOINT}/.auth/login/aad`, body)
      .subscribe(appServiceAuthResponse => {
        this.appServiceAuthResponse = appServiceAuthResponse;
        this.appServAuthorizationToken = this.appServiceAuthResponse.authenticationToken;
      });
  }

  callProtectedApi() {
    const headers = new HttpHeaders().set("X-ZUMO-AUTH", this.appServAuthorizationToken!)
    this.http.get(`${APPSERV_ENDPOINT}/api/protected`, { headers: headers })
      .subscribe(response => {
        this.protectedData = response.toString();
      });
  }

}
