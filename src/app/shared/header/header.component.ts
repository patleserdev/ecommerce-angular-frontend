import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component.js';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
