import { Component, Renderer2 } from '@angular/core';
import { CvService } from './services/cv.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent {
  constructor(private cvService: CvService) {}

  ngOnInit() {
    this.cvService.init();
  }
}
