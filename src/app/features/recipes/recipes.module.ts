import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipesRoutingModule } from './recipes-routing.module';

import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { RecipesDetailsComponent } from './recipes-details/recipes-details.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RecipesRoutingModule,
    RecipesListComponent,
    RecipesDetailsComponent
  ]
})
export class RecipesModule {}