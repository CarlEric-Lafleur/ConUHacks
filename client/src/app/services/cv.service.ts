import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CvService {
  private renderer: Renderer2;
  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  isCVLoaded: boolean = false;

  init() {
    if (this.isCVLoaded) {
      return;
    }
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
    this.isCVLoaded = true;
    console.log('OpenCV.js is ready');
  }
}
