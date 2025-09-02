import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Recipe } from '../models/recipe';
import { RecipeRequest } from '../models/recipe-request';
import { RecipesService } from '../services/recipes.service';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './recipes-list.component.html'
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = [];
  form!: FormGroup;
  showForm = false;
  editing = false;
  editingId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private recipesService: RecipesService
  ) {}

  ngOnInit(): void {
    this.loadRecipes();

    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      ingredientes: ['', Validators.required],
      tiempoPreparacion: [0, [Validators.required, Validators.min(1), Validators.max(1440)]],
      categoriaId: [null, Validators.required],
      descripcion: ['', [Validators.maxLength(500)]],
      fotoUrl: ['', [Validators.maxLength(300)]]
    });
  }

  loadRecipes(): void {
    this.loading = true;
    this.recipesService.getAll().subscribe({
      next: (data) => {
        this.recipes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando recetas', err);
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

  startEdit(recipe: Recipe): void {
    this.showForm = true;
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
    categoria: {
      id: formValue.categoriaId,
      nombre: "-" 
    },
    descripcion: formValue.descripcion,
    fotoUrl: formValue.fotoUrl
  };

  if (this.editing && this.editingId) {
    this.recipesService.update(this.editingId, request).subscribe({
      next: () => {
        this.loadRecipes();
        this.cancel();
      },
      error: (err) => console.error('Error actualizando receta', err)
    });
  } else {
    this.recipesService.create(request).subscribe({
      next: () => {
        this.loadRecipes();
        this.cancel();
      },
      error: (err) => {
        console.error('Error creando receta', err);
        if (err.error?.errors) {
          console.error('Validation errors:', err.error.errors);
        }
      }
    });
  }
}


  confirmDelete(recipe: Recipe): void {
    if (confirm(`¿Eliminar receta "${recipe.nombre}"?`)) {
      this.recipesService.delete(recipe.id).subscribe({
        next: () => this.loadRecipes(),
        error: (err) => console.error('Error eliminando receta', err)
      });
    }
  }

  cancel(): void {
    this.showForm = false;
    this.editing = false;
    this.editingId = null;
    this.form.reset();
  }

  trackById(index: number, item: Recipe): number {
    return item.id;
  }
}