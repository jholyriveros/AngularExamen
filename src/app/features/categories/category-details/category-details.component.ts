import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from '../models/categoria';
import { CategoriaService } from '../services/categoria.service';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [],
  templateUrl: './category-details.component.html'
})

export class CategoryDetailsComponent implements OnInit {
  categoria: Categoria | null = null;

  constructor(
    private route: ActivatedRoute,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.categoriaService.getById(id).subscribe({
        next: c => this.categoria = c,
        error: err => { console.error(err); alert('Error al cargar categoría'); }
      });
    }
  }
}