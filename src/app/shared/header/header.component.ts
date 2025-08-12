import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component.js';
import { HeaderPromoBannerComponent } from '../header-promo-banner/header-promo-banner.component.js';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavbarComponent,HeaderPromoBannerComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
