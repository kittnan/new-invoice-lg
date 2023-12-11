import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpItemCodeService {
  private URL = environment.API;
  constructor(private http: HttpClient) {}
  get(): Observable<any> {
    return this.http.get(`${this.URL}/item-code`);
  }
  create(data: any): Observable<any> {
    return this.http.post(`${this.URL}/item-code/create`, data);
  }
  update(data: any): Observable<any> {
    return this.http.put(`${this.URL}/item-code/update`, data);
  }
  import(data: any): Observable<any> {
    return this.http.post(`${this.URL}/item-code/import`, data);
  }
}
