import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  medicines = [
    { name: 'Medicine 1' },
    { name: 'Medicine 2' },
    { name: 'Medicine 3' },
  ];
}
