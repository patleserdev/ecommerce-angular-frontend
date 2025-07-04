import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component.js';
import { FooterComponent } from '../../shared/footer/footer.component.js';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent
{

}
