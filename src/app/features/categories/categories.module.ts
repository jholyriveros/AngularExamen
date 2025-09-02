import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoriesRoutingModule } from './categories-routing.module';

import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryDetailsComponent } from './category-details/category-details.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CategoriesRoutingModule,
    CategoriesListComponent,
    CategoryDetailsComponent
  ]
})
export class CategoriesModule {}