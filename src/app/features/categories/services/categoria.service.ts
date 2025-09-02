import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Categoria } from '../models/categoria';
import { CategoriaRequest } from '../models/categoria-request';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private baseUrl = `${environment.API_BASE}/api/Categorias`;

  constructor(private http: HttpClient) {}

  private normalize(item: any): Categoria {
    if (!item) return item;
    return {
      id: item.id ?? item.Id,
      nombre: item.nombre ?? item.Nombre
    } as Categoria;
  }

  getAll(): Observable<Categoria[]> {
    return this.http.get<any[]>(this.baseUrl)
      .pipe(map(arr => (arr || []).map(item => this.normalize(item))));
  }

  getById(id: number): Observable<Categoria> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(map(item => this.normalize(item)));
  }

  create(payload: CategoriaRequest): Observable<Categoria> {
    return this.http.post<any>(this.baseUrl, payload).pipe(map(item => this.normalize(item)));
  }

  update(id: number, payload: CategoriaRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}