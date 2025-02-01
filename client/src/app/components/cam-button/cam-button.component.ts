import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { HttpCommunicationService } from '../../services/http-communication/http-communication.service';

declare var cv: any;

@Component({
  selector: 'app-cam-button',
  standalone: false,

  templateUrl: './cam-button.component.html',
  styleUrl: './cam-button.component.scss',
})
export class CamButtonComponent {
  public showWebcam = false;
  public streaming = true;
  public webcamImage?: WebcamImage = undefined;

  //   @ViewChild('canvas', { static: false }) canvas!: HTMLCanvasElement;

  toggleCam() {
    this.showWebcam = !this.showWebcam;
  }

  constructor(
    private renderer: Renderer2,
    private communicationService: HttpCommunicationService
  ) {}

  isProcessing: boolean = false;
  isFound: boolean = false;

  ngOnInit() {
    const script = this.renderer.createElement('script');
    script.src = `opencv.js`;
    script.onload = () => {
      this.onOpenCvReady();
    };
    script.type = 'text/javascript';
    this.renderer.appendChild(document.head, script);
  }

  async onOpenCvReady() {
    (window as any).cv = await (window as any).cv;
    console.log('OpenCV.js is ready');

    this.startCamera();
    // this.startVideoStream();
    // this.initializeOpenCV();
  }

  ngOnDestroy(): void {
    // this.stopCamera();
  }

  // Start webcam
  async startCamera() {
    let video: any = document.getElementById('videoInput');
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);
    console.log(src);
    console.log(dst);
    console.log(cap);

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      video.play();
    });

    // schedule the first one.
    setTimeout(() => this.processVideo(src, dst, cap), 0);
  }

  processIsFound(foundRect: any) {
    let canvas: any = document.getElementById('canvasOutput');

    let image = canvas.toDataURL('image/jpeg');

    foundRect.sort((a: any, b: any) => b.area - a.area);

    console.log(image, foundRect.slice(0, 2));
    const formData = new FormData();
    formData.append('images', image);
    formData.append('images', foundRect[0].imageUrl);
    formData.append('images', foundRect[1].imageUrl);
    this.communicationService.basicPost('/posology', formData);
  }

  processVideo(src: any, dst: any, cap: any) {
    const FPS = 30;
    try {
      if (!this.streaming || this.isFound) {
        // clean and stop.
        src.delete();
        if (this.isFound) {
          this.isFound = false;
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
      const foundRect = [];
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

          // Encode the ROI as a JPEG
          //   let imgData = new cv.Mat();
          //   cv.imencode('.jpg', roi, imgData);

          //   // Convert to Uint8Array
          //   let byteArray = new Uint8Array(imgData.data);

          //   // Create a Blob and generate a downloadable link
          //   let blob = new Blob([byteArray], { type: 'image/jpeg' });

          foundRect.push({ imageUrl, area });

          let color = new cv.Scalar(0, 255, 0, 255); // Green color
          let point1 = new cv.Point(rect.x, rect.y);
          let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
          cv.rectangle(src, point1, point2, color, 2); // Draw rectangle
          count++;
        } else {
          approx.delete();
        }
      }
      if (count >= 2) {
        this.isFound = true;
        this.processIsFound(foundRect);
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
// }

// Stop webcam
//   stopCamera() {
//     const stream = this.video.srcObject as MediaStream;
//     const tracks = stream.getTracks();
//     tracks.forEach((track) => track.stop());
//     this.video.srcObject = null;
//   }

// Process video frame
//   processFrame() {
//     if (!this.isProcessing) {
//       this.isProcessing = true;
//       this.context.drawImage(
//         this.video,
//         0,
//         0,
//         this.canvas.width,
//         this.canvas.height
//       );

//       console.log(this.canvas);
//       console.log(cv);
//       const frame = cv.imread(this.canvas); // Read the image from canvas using OpenCV.js

//       // Convert to grayscale
//       const gray = new cv.Mat();
//       cv.cvtColor(frame, gray, cv.COLOR_RGBA2GRAY);

//       // Apply GaussianBlur
//       const blurred = new cv.Mat();
//       cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

//       // Canny edge detection
//       const edges = new cv.Mat();
//       cv.Canny(blurred, edges, 50, 150, 3);

//       // Find contours
//       const contours = new cv.MatVector();
//       const hierarchy = new cv.Mat();
//       cv.findContours(
//         edges,
//         contours,
//         hierarchy,
//         cv.RETR_TREE,
//         cv.CHAIN_APPROX_SIMPLE
//       );

//       let count = 0;
//       for (let i = 0; i < contours.size(); i++) {
//         const contour = contours.get(i);
//         const approx = new cv.Mat();
//         cv.approxPolyDP(
//           contour,
//           approx,
//           0.02 * cv.arcLength(contour, true),
//           true
//         );

//         if (approx.rows === 4 && cv.contourArea(approx) > 10000) {
//           const rect = cv.boundingRect(approx);
//           frame.drawContours([approx], 0, new cv.Scalar(0, 255, 0), 3);
//           count++;
//         }
//         approx.delete();
//       }

//       // Show processed frame on canvas
//       console.log(frame);
//       cv.imshow(this.canvas, frame);

//       if (count >= 5) {
//         // Stop processing if count is >= 5
//         // this.stopCamera();
//       }

//       frame.delete();
//       gray.delete();
//       blurred.delete();
//       edges.delete();
//       contours.delete();
//       hierarchy.delete();

//       this.isProcessing = false;

//       // Repeat the process after a short delay
//       if (this.isProcessing) {
//         requestAnimationFrame(() => this.processFrame());
//       }
//     }
//   }
// }
