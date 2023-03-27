import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private http: HttpClient
  ) { }

  callProtectedApi() {
    this.http.get("http://localhost:5291/api/protected")
      .subscribe(response => {
        console.log(response);
        this.response = response;
      });
  }

}
