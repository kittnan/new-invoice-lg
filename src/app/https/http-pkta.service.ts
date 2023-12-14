import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpPktaService {
  private URL = environment.API;
  constructor(private http: HttpClient) {}
  get(): Observable<any> {
    return this.http.get(`${this.URL}/pkta`);
  }
  checkDuplicate(param:HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/pkta/checkDuplicate`,{
      params:param
    });
  }
  search(param:HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/pkta/search`,{
      params:param
    });
  }
  getKey(params: HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/pkta`, {
      params: params,
    });
  }
  create(data: any): Observable<any> {
    return this.http.post(`${this.URL}/pkta/create`, data);
  }
  createOrUpdate(data: any): Observable<any> {
    return this.http.post(`${this.URL}/pkta/createOrUpdate`, data);
  }
  update(data: any): Observable<any> {
    return this.http.put(`${this.URL}/pkta/update`, data);
  }
  deleteByInvoice(data: any): Observable<any> {
    return this.http.put(`${this.URL}/pkta/deleteByInvoice`, data);
  }

}
