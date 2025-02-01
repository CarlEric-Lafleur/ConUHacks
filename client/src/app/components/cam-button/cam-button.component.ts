import { Component } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-cam-button',
  standalone: false,

  templateUrl: './cam-button.component.html',
  styleUrl: './cam-button.component.scss'
})
export class CamButtonComponent {
  public showWebcam = false;
  public webcamImage?: WebcamImage = undefined;


  toggleCam(){
    this.showWebcam = !this.showWebcam;
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }


  private trigger: Subject<void> = new Subject<void>();

  public triggerSnapshot(): void {
    while (this.showWebcam){
      setTimeout(()=>{
      this.trigger.next();
      },1000)

    }
  }

   public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

}
