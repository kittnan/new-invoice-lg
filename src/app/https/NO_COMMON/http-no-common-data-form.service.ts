import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HttpNoCommonDataFormService {


  private URL = environment.API;
  private SUB = 'no_common/no_common_data_form';
  constructor(private http: HttpClient) { }

  search(param: HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/${this.SUB}/search`, {
      params: param
    });
  }
  get(p: HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/${this.SUB}`, {
      params: p
    });
  }
  getForConfig(p: HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/${this.SUB}/getForConfig`, {
      params: p
    });
  }
  update(data: any): Observable<any> {
    return this.http.post(`${this.URL}/${this.SUB}/update`, data);
  }
}
