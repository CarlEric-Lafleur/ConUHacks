import { Component, EventEmitter, Output, Renderer2 } from '@angular/core';
import { HttpCommunicationService } from '../../services/http-communication/http-communication.service';
import { CvService } from '../../services/cv.service';
import { Prescription } from '../../interfaces/prescription.interface';
import { PosologyInfo } from '../../interfaces/posology-info';

declare var cv: any;
@Component({
  selector: 'app-cam',
  standalone: false,

  templateUrl: './cam.component.html',
  styleUrl: './cam.component.scss',
})
export class CamComponent {
  public streaming = true;

  @Output() waitingForResponse = new EventEmitter<boolean>();
  @Output() foundPrescriptionEvent = new EventEmitter<PosologyInfo>();

  constructor(
    private communicationService: HttpCommunicationService,
    private cvService: CvService
  ) {}

  isFound: boolean = false;

  ngOnInit() {
    while (true) {
      console.log(this.cvService.isCVLoaded);
      if (this.cvService.isCVLoaded) {
        this.startCamera();
        return;
      }
    }
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  stopCamera() {
    this.streaming = false;
  }

  // Start webcam
  async startCamera() {
    let video: any = document.getElementById('videoInput');
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      video.play();
    });

    // schedule the first one.
    setTimeout(() => this.processVideo(src, dst, cap), 0);
  }

  processIsFound() {
    let canvas: any = document.getElementById('canvasOutput');
    const formData = new FormData();
    this.foundRect.sort((a: any, b: any) => b.area - a.area);

    canvas.toBlob((blob: any) => {
      formData.append('files', blob);
      this.waitingForResponse.emit(true);
      this.communicationService
        .basicPost('posology', formData)
        .subscribe((x) => {
          console.log(x);
          this.foundPrescriptionEvent.emit(x as PosologyInfo);
          this.waitingForResponse.emit(false);
        });
    });

    this.foundRect = [];
  }
  foundRect: any = [];

  processVideo(src: any, dst: any, cap: any) {
    const FPS = 30;
    try {
      if (!this.streaming || this.isFound) {
        // clean and stop.
        src.delete();
        if (this.isFound) {
          this.isFound = false;
          this.processIsFound();
        }
        dst.delete();
        return;
      }
      let begin = Date.now();
      // start processing.
      cap.read(src);

      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      const blurred = new cv.Mat();
      cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

      const edges = new cv.Mat();
      cv.Canny(blurred, edges, 50, 150, 3);

      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(
        edges,
        contours,
        hierarchy,
        cv.RETR_CCOMP,
        cv.CHAIN_APPROX_SIMPLE
      );

      let count = 0;
      this.foundRect = [];
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        let approx = new cv.Mat();

        cv.approxPolyDP(
          contour,
          approx,
          0.02 * cv.arcLength(contour, true),
          true
        );
        let approx_vector = new cv.MatVector();
        approx_vector.push_back(approx);

        const area = cv.contourArea(approx);

        if (approx.rows === 4 && area > 1500) {
          let rect = cv.boundingRect(approx); // Get bounding box
          // Extract the rectangular region
          let roi = src.roi(rect);

          let canvas = document.createElement('canvas');
          cv.imshow(canvas, roi); // Draw the Mat onto the canvas

          // Step 3: Convert Canvas to JPEG and Download
          let imageUrl = canvas.toDataURL('image/jpeg');

          this.foundRect.push({ imageUrl, area });

          let color = new cv.Scalar(0, 255, 0, 255); // Green color
          let point1 = new cv.Point(rect.x, rect.y);
          let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
          cv.rectangle(src, point1, point2, color, 2); // Draw rectangle
          count++;
        }
        approx.delete();
      }
      if (count >= 5) {
        this.isFound = true;
      }

      cv.imshow('canvasOutput', src);

      // schedule the next one.
      let delay = 1000 / FPS - (Date.now() - begin);
      gray.delete();
      blurred.delete();
      edges.delete();
      hierarchy.delete();
      setTimeout(() => this.processVideo(src, dst, cap), delay);
    } catch (err) {
      console.error(err);
    }
  }
}
