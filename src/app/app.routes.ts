import { Routes } from '@angular/router';
import { CategoriesListComponent } from './features/categories/categories-list/categories-list.component';
import { CategoryDetailsComponent } from './features/categories/category-details/category-details.component';
import { RecipesListComponent } from './features/recipes/recipes-list/recipes-list.component';
import { RecipesDetailsComponent } from './features/recipes/recipes-details/recipes-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'categories',
    pathMatch: 'full'
  },
  {
    path: 'categories',
    component: CategoriesListComponent
  },
  {
    path: 'categories/:id',
    component: CategoryDetailsComponent
  },
  {
    path: 'recipes',
    component: RecipesListComponent
  },
  {
    path: 'recipes/:id',
    component: RecipesDetailsComponent
  }
];