import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import * as faceapi from 'face-api.js';
import { Router } from '@angular/router';

type State = 'undetected' | 'rest' | 'open' | 'interupt' | 'swallow';

@Component({
  selector: 'app-face',
  standalone: false,
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.scss'],
})
export class FaceComponent implements OnInit, AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  @ViewChild('videoContainer') videoContainer!: ElementRef;
  state: State = 'undetected';
  window: (number | null)[] = [];

  constructor(private renderer: Renderer2, private router: Router) {}

  async ngOnInit() {
    await await faceapi.loadFaceLandmarkModel('/models');
    await await faceapi.loadSsdMobilenetv1Model('/models');
    await await faceapi.loadFaceExpressionModel('/models');
  }

  async ngAfterViewInit() {
    this.startVideo();
  }

  startVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch((err) => console.error('Error accessing webcam: ', err));
  }

  changeState(state: State, window: (number | null)[]): State {
    if (state === 'undetected') {
      if (window.filter((v) => v !== null).length > 3) {
        return 'rest';
      }
      return 'undetected';
    }

    if (state === 'rest') {
      if (window.filter((v) => (v || 0) > 0.1).length > 3) {
        return 'open';
      }
      return 'rest';
    }
    if (state === 'open') {
      if (window.filter((v) => (v || 0) < 0.1).length > 2) {
        return 'swallow';
      }
      return 'open';
    }
    if (state === 'interupt') {
      if (window.filter((v) => (v || 0) < 0.5).length > 2) {
        return 'swallow';
      }
      return 'interupt';
    }
    return 'swallow';
  }

  async onPlay() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      if (this.window.length >= 5) {
        this.state = this.changeState(this.state, this.window);
        this.window = [];
        console.log(this.state);
        if (this.state === 'swallow') {
          console.log('swallow');
          this.completeSteps();
        }
      }

      const detections = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceExpressions();
      if (!detections) {
        this.window.push(null);
        return;
      }
      this.window.push(detections?.expressions.surprised);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      if (resizedDetections) {
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      }
    }, 100);
  }

  completeSteps() {
    this.renderer.setStyle(
      this.videoContainer.nativeElement,
      'background-color',
      '#4caf50'
    );
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 2000);
  }
}
