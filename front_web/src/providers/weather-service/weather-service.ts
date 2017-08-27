import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
Generated class for the WeatherServiceProvider provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular DI.
*/
@Injectable()
export class WeatherServiceProvider {

  constructor(public http: Http) {

  }

  apiURL = 'http://localhost:8101/weather'
  private weatherResult: any;

  loadWeather(lat, lon) {
    return new Promise((resolve, reject) => {
      if (undefined !== this.weatherResult) {
        resolve(this.weatherResult);
      } else {
        this.http.get(`${this.apiURL}?latitude=${lat}&longitude=${lon}`)
        .map(res => res.json())
        .subscribe(data => {
          this.weatherResult = data;
          resolve(this.weatherResult);
        }, error => {
          reject(error);
        });
      }
    });
  }
}
