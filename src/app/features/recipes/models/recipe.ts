import { Categoria } from '../../categories/models/categoria';

export interface Recipe {
  id: number;
  nombre: string;
  ingredientes: string;
  tiempoPreparacion: number;
  categoriaId: number;
  categoria?: Categoria;   // 🔹 aquí agregamos la relación
  descripcion?: string;
  fotoUrl?: string;
}