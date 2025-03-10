import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpSapReprintService {

  private URL = environment.API;
  private SUB = 'sap/sap_reprint';
  constructor(private http: HttpClient) { }

  get(): Observable<any> {
    return this.http.get(`${this.URL}/${this.SUB}`);
  }
  search(param: HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/${this.SUB}/search`, {
      params: param
    });
  }
  getKey(params: HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/${this.SUB}`, {
      params: params,
    });
  }
  create(data: any): Observable<any> {
    return this.http.post(`${this.URL}/${this.SUB}/create`, data);
  }
  createOrUpdate(data: any): Observable<any> {
    return this.http.post(`${this.URL}/${this.SUB}/createOrUpdate`, data);
  }
  update(data: any): Observable<any> {
    return this.http.put(`${this.URL}/${this.SUB}/update`, data);
  }
}
