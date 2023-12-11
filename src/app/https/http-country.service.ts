import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpCountryService {
  private URL = environment.API;
  constructor(private http: HttpClient) {}
  get(): Observable<any> {
    return this.http.get(`${this.URL}/country`);
  }
  create(data: any): Observable<any> {
    return this.http.post(`${this.URL}/country/create`, data);
  }
  update(data: any): Observable<any> {
    return this.http.put(`${this.URL}/country/update`, data);
  }

  import(data: any): Observable<any> {
    return this.http.post(`${this.URL}/country/import`, data);
  }
}
