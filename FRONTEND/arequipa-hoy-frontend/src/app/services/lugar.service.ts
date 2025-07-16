import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LugarService {
  private apiUrl = 'http://127.0.0.1:8000/api/lugares/';
  constructor(private http: HttpClient) { }
  getLugares(): Observable<any> { return this.http.get<any>(this.apiUrl); }
}