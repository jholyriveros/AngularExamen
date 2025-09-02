import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Recipe } from '../models/recipe';
import { RecipesService } from '../services/recipes.service';
import { ToastService } from '../../../services/toast.service';
import { CategoriaService } from '../../categories/services/categoria.service';
import { Categoria } from '../../categories/models/categoria';

declare var bootstrap: any;

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './recipes-list.component.html'
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = [];
  paginatedRecipes: Recipe[] = []; 
  page = 1;                      
  pageSize = 5;  
  totalPages = 1;
  categories: Categoria[] = [];
  form!: FormGroup;
  editing = false;
  editingId: number | null = null;
  loading = false;
  selectedRecipe: any = null;

  constructor(
    private fb: FormBuilder,
    private recipesService: RecipesService,
    private categoriaService: CategoriaService,
    private toast: ToastService //
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
    this.loadCategories();

    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      ingredientes: ['', Validators.required],
      tiempoPreparacion: [0, [Validators.required, Validators.min(1), Validators.max(1440)]],
      categoriaId: [null, Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      fotoUrl: ['', [Validators.required, Validators.maxLength(300)]],
    });
  }

  loadCategories(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.toast.show('❌ Error cargando categorías', 'danger');
      }
    });
  }

  loadRecipes(): void {
    this.loading = true;
    this.recipesService.getAll().subscribe({
      next: (data) => {
        this.recipes = data;
        this.totalPages = Math.ceil(this.recipes.length / this.pageSize);
        this.setPage(1);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando recetas', err);
        this.toast.show('❌ Error cargando recetas', 'danger');
        this.loading = false;
      }
    });
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedRecipes = this.recipes.slice(start, end);
  }

  startCreate(): void {
    this.editing = false;
    this.editingId = null;
    this.form.reset();
    this.openModal();
  }

  startEdit(recipe: Recipe): void {
    this.editing = true;
    this.editingId = recipe.id;
    this.form.patchValue({
      nombre: recipe.nombre,
      ingredientes: recipe.ingredientes,
      tiempoPreparacion: recipe.tiempoPreparacion,
      categoriaId: recipe.categoriaId,
      descripcion: recipe.descripcion,
      fotoUrl: recipe.fotoUrl
    });
    this.openModal();
  }

  submit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const request: any = {
      id: this.editing ? this.editingId : 0,
      nombre: formValue.nombre,
      ingredientes: formValue.ingredientes,
      tiempoPreparacion: formValue.tiempoPreparacion,
      categoriaId: formValue.categoriaId,
      categoria: { id: formValue.categoriaId, nombre: '-' },
      descripcion: formValue.descripcion,
      fotoUrl: formValue.fotoUrl
    };

    if (this.editing && this.editingId) {
      this.recipesService.update(this.editingId, request).subscribe({
        next: () => {
          this.loadRecipes();
          this.closeModal();
          this.toast.show('✏️ Receta actualizada correctamente', 'success');
        },
        error: (err) => {
          console.error('Error actualizando receta', err);
          this.toast.show('❌ Error actualizando la receta', 'danger');
        }
      });
    } else {
      this.recipesService.create(request).subscribe({
        next: () => {
          this.loadRecipes();
          this.closeModal();
          this.toast.show('📂 Receta creada correctamente', 'success');
        },
        error: (err) => {
          console.error('Error creando receta', err);
          this.toast.show('❌ Error creando la receta', 'danger');
          if (err.error?.errors) {
            console.error('Validation errors:', err.error.errors);
          }
        }
      });
    }
  }

confirmDelete(recipe: Recipe): void {
  this.recipesService.delete(recipe.id).subscribe({
    next: () => {
      this.loadRecipes();
      this.toast.show('✅ Receta eliminada correctamente', 'success');
    },
    error: (err) => {
      console.error('Error eliminando receta', err);
      this.toast.show('❌ Error eliminando la receta', 'danger');
    }
  });
}

  private openModal(): void {
    const modalElement = document.getElementById('recipeModal');
    if (modalElement) {
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalElement, { backdrop: 'static' });
      }
      modalInstance.show();
    }
  }

  private closeModal(): void {
    const modalEl = document.getElementById('recipeModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  trackById(index: number, item: Recipe): number {
    return item.id;
  }

  openPhoto(recipe: any) {
  this.selectedRecipe = recipe;
}
}