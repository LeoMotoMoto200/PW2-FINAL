import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LugarService {
  private apiUrl = 'https://arequipa-hoy-backend.onrender.com/api/lugares/';
  constructor(private http: HttpClient) { }
  getLugares(): Observable<any> { return this.http.get<any>(this.apiUrl); }
}