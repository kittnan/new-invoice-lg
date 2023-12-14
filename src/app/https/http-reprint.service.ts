import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpReprintService {

  private URL = environment.API;
  constructor(private http: HttpClient) {}

  get(): Observable<any> {
    return this.http.get(`${this.URL}/reprint`);
  }
  search(param:HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/reprint/search`,{
      params:param
    });
  }
  getKey(params: HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/reprint`, {
      params: params,
    });
  }
  create(data: any): Observable<any> {
    return this.http.post(`${this.URL}/reprint/create`, data);
  }
  createOrUpdate(data: any): Observable<any> {
    return this.http.post(`${this.URL}/reprint/createOrUpdate`, data);
  }
  update(data: any): Observable<any> {
    return this.http.put(`${this.URL}/reprint/update`, data);
  }
}
