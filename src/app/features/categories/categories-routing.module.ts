import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryDetailsComponent } from './category-details/category-details.component';

const routes: Routes = [
  { path: '', component: CategoriesListComponent },
  { path: ':id', component: CategoryDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {}