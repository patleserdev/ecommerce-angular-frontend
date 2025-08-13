import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component.js';
import { FooterComponent } from '../../shared/footer/footer.component.js';
import { RouterOutlet } from '@angular/router';
import { BackToTopComponent } from '../../shared/back-to-top/back-to-top.component.js';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,RouterOutlet,BackToTopComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent
{

}
