import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PublicClientApplication, Configuration } from "@azure/msal-browser";
import { environment } from '../environments/environment';

const MSAL_CONFIG: Configuration = {
  auth: {
    clientId: environment.AZUREAD_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${environment.AZUREAD_TENANT_ID}`
  }
};

const loginRequest = {
  scopes: ["User.Read"]
};

// const APPSERV_ENDPOINT = "http://localhost:5291"
const APPSERV_ENDPOINT = environment.APPSERV_ENDPOINT_URL

const clientapp = new PublicClientApplication(MSAL_CONFIG);

type Response = {
  value?: string
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'appservng';

  response!: Response;
  accessToken = "";

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
      .subscribe(response => {
        console.log(response);
      });
  }

  callProtectedApi() {
    this.http.get(`${APPSERV_ENDPOINT}/api/protected`)
      .subscribe(response => {
        console.log(response);
        this.response = response;
      });
  }

}
