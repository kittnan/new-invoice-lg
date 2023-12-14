import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpPackingService {
  private URL = environment.API;
  constructor(private http: HttpClient) {}
  get(): Observable<any> {
    return this.http.get(`${this.URL}/packing`);
  }
  getKey(params: HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/packing`, {
      params: params,
    });
  }
  create(data: any): Observable<any> {
    return this.http.post(`${this.URL}/packing/create`, data);
  }
  update(data: any): Observable<any> {
    return this.http.put(`${this.URL}/packing/update`, data);
  }
  createOrUpdate(data: any): Observable<any> {
    return this.http.post(`${this.URL}/packing/createOrUpdate`, data);
  }
}
