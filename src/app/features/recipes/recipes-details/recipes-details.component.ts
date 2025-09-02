import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Recipe } from '../models/recipe';
import { RecipesService } from '../services/recipes.service';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [NgIf],
  templateUrl: './recipes-details.component.html'
})
export class RecipesDetailsComponent implements OnInit {
  recipe: Recipe | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipesService: RecipesService
  ) {}

  ngOnInit(): void {
    this.loadRecipe();
  }

  loadRecipe(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.loading = true;
    this.recipesService.getById(id).subscribe({
      next: (data) => {
        this.recipe = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando receta', err);
        this.loading = false;
      }
    });
  }

  back(): void {
    this.router.navigate(['/recipes']);
  }
}