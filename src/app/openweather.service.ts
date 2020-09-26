import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenweatherService {

  constructor(protected http: HttpClient) { }

  getWeather(city:String) {
    return this.http.get('https://api.openweathermap.org/data/2.5/weather?q='+city+'&units=metric&appid='+environment.api_key);
  }

  getForecast(city:String) {
    return this.http.get('https://api.openweathermap.org/data/2.5/forecast?q='+city+'&units=metric&appid='+environment.api_key);
  }

  getUsers() {
    return this.http.get('https://randomuser.me/api/?results=3');
  }

}
