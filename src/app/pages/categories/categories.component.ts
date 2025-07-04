import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesDatasComponent } from '../../categoriesDatas/categoriesDatas.component.js';
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, CategoriesDatasComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {}
