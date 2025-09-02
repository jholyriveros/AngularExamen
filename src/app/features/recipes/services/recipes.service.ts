import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Recipe } from '../models/recipe';
import { RecipeRequest } from '../models/recipe-request';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private baseUrl = `${environment.API_BASE}/api/Receta`;

  constructor(private http: HttpClient) {}

  private normalize(item: any): Recipe {
    if (!item) return item;
    return {
      id: item.id ?? item.Id,
      nombre: item.nombre ?? item.Nombre,
      ingredientes: item.ingredientes ?? item.Ingredientes,
      tiempoPreparacion: item.tiempoPreparacion ?? item.TiempoPreparacion,
      categoriaId: item.categoriaId ?? item.CategoriaId,
      descripcion: item.descripcion ?? item.Descripcion,
      fotoUrl: item.fotoUrl ?? item.FotoUrl,
      categoria: item.categoria ?? item.Categoria
    } as Recipe;
  }

  getAll(): Observable<Recipe[]> {
    return this.http.get<any[]>(this.baseUrl)
      .pipe(map(arr => (arr || []).map(item => this.normalize(item))));
  }

  getById(id: number): Observable<Recipe> {
    return this.http.get<any>(`${this.baseUrl}/${id}`)
      .pipe(map(item => this.normalize(item)));
  }

  create(payload: RecipeRequest): Observable<Recipe> {
    return this.http.post<any>(this.baseUrl, payload)
      .pipe(map(item => this.normalize(item)));
  }

  update(id: number, payload: RecipeRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getByCategoriaId(id: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/categoria/${id}`);
  }
}