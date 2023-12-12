import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpUsersService {
  private URL = environment.API;
  constructor(private http: HttpClient) {}

  get(): Observable<any> {
    return this.http.get(`${this.URL}/users`);
  }
  import(data: any): Observable<any> {
    return this.http.post(`${this.URL}/users/import`, data);
  }

}
