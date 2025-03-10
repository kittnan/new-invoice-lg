import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HttpSapFormService {
  private URL = environment.API;
  private SUB = 'sap/sap_form';
  constructor(private http: HttpClient) { }

  get(p: HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/${this.SUB}`, {
      params: p
    });
  }
  search(param: HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/${this.SUB}/search`, {
      params: param
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
  updateByInvoice(data: any): Observable<any> {
    return this.http.put(`${this.URL}/${this.SUB}/updateByInvoice`, data);
  }
  deleteAllByInvoice(p: HttpParams): Observable<any> {
    return this.http.delete(`${this.URL}/${this.SUB}/deleteAllByInvoice`, {
      params: p
    });
  }
}
