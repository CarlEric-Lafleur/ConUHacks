import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { HttpCommunicationService } from '../../services/http-communication/http-communication.service';

@Component({
  selector: 'app-cam-button',
  standalone: false,

  templateUrl: './cam-button.component.html',
  styleUrl: './cam-button.component.scss',
})
export class CamButtonComponent {
  public showWebcam = false;

  toggleCam() {
    this.showWebcam = !this.showWebcam;
  }
}
