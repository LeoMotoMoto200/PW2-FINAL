import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrganizadorService {
  private apiUrl = 'https://arequipa-hoy-backend.onrender.com/api/organizadores/';
  constructor(private http: HttpClient) { }
  getOrganizadores(): Observable<any> { return this.http.get<any>(this.apiUrl); }
}