import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class RestApiService {
  baseUrl = 'http://localhost:3000/';
  constructor(private http: HttpClient) { }

  getHeaders(){
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set("token", token) : null;
  }

  get(link : string){
    return this.http.get(this.baseUrl + link, {headers: this.getHeaders()}).toPromise();
  }

  post(link: string, body: any) {
    return this.http.post(this.baseUrl + link, body, {headers: this.getHeaders()}).toPromise();
  }
}
