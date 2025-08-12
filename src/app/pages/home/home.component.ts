import { Component } from '@angular/core';
import { DiscoverComponent } from './discover/discover.component.js';
import { NewSalesComponent } from './new-sales/new-sales.component.js';
import { TopSalesComponent } from './top-sales/top-sales.component.js';
import { NewsletterformComponent } from './newsletterform/newsletterform.component.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DiscoverComponent,NewSalesComponent,TopSalesComponent,NewsletterformComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
