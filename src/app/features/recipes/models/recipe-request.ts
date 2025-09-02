export interface RecipeRequest {
  nombre: string;
  ingredientes: string;
  tiempoPreparacion: number;
  categoriaId: number;
  descripcion?: string;
  fotoUrl?: string;
}