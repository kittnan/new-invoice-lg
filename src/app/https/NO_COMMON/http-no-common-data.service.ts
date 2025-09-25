import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpNoCommonDataService {


  private URL = environment.API;
  private SUB = 'no_common/no_common_data';
  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(`${this.URL}/${this.SUB}/create`, data);
  }
  checkDuplicate(p: HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/${this.SUB}/checkDuplicate`, {
      params: p
    });
  }

  get(p: HttpParams): Observable<any> {
    return this.http.get(`${this.URL}/${this.SUB}`, {
      params: p
    });
  }
}
