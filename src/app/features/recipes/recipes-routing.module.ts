import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { RecipesDetailsComponent } from './recipes-details/recipes-details.component';

const routes: Routes = [
  { path: '', component: RecipesListComponent },
  { path: ':id', component: RecipesDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {}