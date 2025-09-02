import { Categoria } from '../../categories/models/categoria';

export interface Recipe {
  id: number;
  nombre: string;
  ingredientes: string;
  tiempoPreparacion: number;
  categoriaId: number;
  categoria?: Categoria;
  descripcion?: string;
  fotoUrl?: string;
}