import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PublicClientApplication, Configuration } from "@azure/msal-browser";

const MSAL_CONFIG: Configuration = {
  auth: {
    clientId: "b88bbe32-9e04-42c9-94cc-3d6863810112",
    authority: "https://login.microsoftonline.com/94d47d96-52c0-4b73-b3ae-028fafc55d47"
  }
};

const loginRequest = {
  scopes: ["User.Read"]
};

const APPSERV_ENDPOINT = "http://localhost:5291"

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
    this.http.get(`${APPSERV_ENDPOINT}/.auth/login/aad`)
      .subscribe(response => {
        console.log(response);
        this.response = response;
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
