import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpFormService {

  private URL = environment.API;
  constructor(private http: HttpClient) {}

  get(p:HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/form`,{
      params:p
    });
  }
  search(param:HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/form/search`,{
      params:param
    });
  }
  // getReprint(p:HttpParams): Observable<any> {
  //   return this.http.get(`${this.URL}/form/getReprint`,{
  //     params:p
  //   });
  // }
  create(data: any): Observable<any> {
    return this.http.post(`${this.URL}/form/create`, data);
  }
  createOrUpdate(data: any): Observable<any> {
    return this.http.post(`${this.URL}/form/createOrUpdate`, data);
  }
  update(data: any): Observable<any> {
    return this.http.put(`${this.URL}/form/update`, data);
  }
  updateByInvoice(data: any): Observable<any> {
    return this.http.put(`${this.URL}/form/updateByInvoice`, data);
  }
  deleteAllByInvoice(p:HttpParams): Observable<any> {
    return this.http.delete(`${this.URL}/form/deleteAllByInvoice`,{
      params:p
    });
  }

}
