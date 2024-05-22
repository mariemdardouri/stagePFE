import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
