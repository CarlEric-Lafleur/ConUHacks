import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { HttpCommunicationService } from '../../services/http-communication/http-communication.service';
import { PosologyInfo } from '../../interfaces/posology-info';

@Component({
  selector: 'app-cam-button',
  standalone: false,

  templateUrl: './cam-button.component.html',
  styleUrl: './cam-button.component.scss',
})
export class CamButtonComponent {
  public showWebcam = false;
  waitingForResponse = false;

  @Output() foundPrescriptionEvent = new EventEmitter<any>();

  toggleCam() {
    this.showWebcam = !this.showWebcam;
  }

  getShowWebcam() {
    return this.showWebcam;
  }

  waitingForResponseEvent(waiting: boolean) {
    this.waitingForResponse = waiting;
  }

  foundPrescription(res: PosologyInfo) {
    this.foundPrescriptionEvent.emit(res);
  }
}
