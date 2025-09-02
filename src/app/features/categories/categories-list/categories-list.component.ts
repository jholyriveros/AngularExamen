import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Categoria } from '../models/categoria';
import { CategoriaRequest } from '../models/categoria-request';
import { CategoriaService } from '../services/categoria.service';
import { ToastService } from '../../../services/toast.service';
import { Recipe } from '../../recipes/models/recipe';
import { RecipesService } from '../../recipes/services/recipes.service';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './categories-list.component.html'
})
export class CategoriesListComponent implements OnInit {
  categorias: Categoria[] = [];
  recipes: Recipe[] = [];
  form!: FormGroup;
  showForm = false;
  editing = false;
  editingId: number | null = null;
  loading = false;
  loadingRecipes = false;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private recipesService: RecipesService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategorias();

    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  loadCategorias(): void {
    this.loading = true;
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.loading = false;
      }
    });
  }

  startCreate(): void {
    this.showForm = true;
    this.editing = false;
    this.editingId = null;
    this.form.reset();
  }

  startEdit(cat: Categoria): void {
    this.showForm = true;
    this.editing = true;
    this.editingId = cat.id;
    this.form.patchValue({ nombre: cat.nombre });
  }

  submit(): void {
    if (this.form.invalid) return;

    const request: CategoriaRequest = {
      nombre: this.form.value.nombre
    };

    if (this.editing && this.editingId) {
      this.categoriaService.update(this.editingId, request).subscribe({
        next: () => {
          this.loadCategorias();
          this.cancel();
          this.toast.show('✏️ Categoría actualizada correctamente', 'success');
        },
        error: (err) => {
          console.error('Error actualizando categoría', err);
          this.toast.show('❌ Error actualizando la categoría', 'danger');
        }
      });
    } else {
      this.categoriaService.create(request).subscribe({
        next: () => {
          this.loadCategorias();
          this.cancel();
          this.toast.show('📂 Categoría creada correctamente', 'success');
        },
        error: (err) => {
          console.error('Error creando categoría', err);
          this.toast.show('❌ Error creando la categoría', 'danger');
        }
      });
    }
  }

  confirmDelete(cat: Categoria): void {
    this.categoriaService.delete(cat.id).subscribe({
      next: () => {
        this.loadCategorias();
        this.toast.show('✅ Categoría eliminada correctamente', 'success');
      },
      error: (err) => {
        console.error('Error eliminando categoría', err);
        this.toast.show('❌ Error eliminando la categoría', 'danger');
      }
    });
  }

  cancel(): void {
    this.showForm = false;
    this.editing = false;
    this.editingId = null;
    this.form.reset();
  }

  trackById(index: number, item: Categoria): number {
    return item.id;
  }

  loadRecipes(categoriaId: number): void {
  this.loadingRecipes = true;
  this.recipes = [];
  this.recipesService.getByCategoriaId(categoriaId).subscribe({
    next: r => {
      this.recipes = r;
      this.loadingRecipes = false;
    },
    error: err => {
      console.error(err);
      alert('Error al cargar recetas');
      this.loadingRecipes = false;
    }
  });
}
}