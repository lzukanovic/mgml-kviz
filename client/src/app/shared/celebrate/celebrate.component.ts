import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';
import {Observable, Subject, takeUntil} from "rxjs";
import {CelebrateService} from "../../services/celebrate.service";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-celebrate',
  templateUrl: './celebrate.component.html',
  styleUrls: ['./celebrate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CelebrateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  canvas!: HTMLCanvasElement; // the reusable canvas element
  confettiCanvas: any; // the canvas function from confetti-canvas library
  confettiLib: any; // the dynamically imported library
  celebrate$!: Observable<any>; // the observable from CelebrateService that will trigger the confetti

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    private renderer2: Renderer2,
    public celebrateService: CelebrateService,
    private elementRef: ElementRef,
  ) {
    this.celebrate$ = this.celebrateService.celebrate$;
  }

  ngOnInit(): void {
    // check that we are client side if using SSR
    if (isPlatformBrowser(this.platformID)) {
      this.celebrate$.pipe(takeUntil(this.destroy$)).subscribe(() => this.celebrate());
    }
  }

  async importCanvas(): Promise<any> {
    this.confettiLib = await import('canvas-confetti'); // es6 dynamic import that returns a promise
    this.canvas = this.renderer2.createElement('canvas'); // create the canvas
  }

  celebrate(): void {
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    let checkCanvasConfettiExists = async () => Promise.resolve(); // set this to resolve regardless if confetti already exists
    if (!this.confettiCanvas) { // if not already imported, replace with importing function
      checkCanvasConfettiExists = this.importCanvas;
    }
    checkCanvasConfettiExists.call(this) // bind to 'this' as the importCanvas function will need the correct 'this'
      .then(() => {
        this.renderer2.appendChild(this.elementRef.nativeElement, this.canvas); // append the canvas

        this.confettiCanvas = this.confettiLib.create(this.canvas, { resize: true }); // create the confetti canvas
        const duration = 3000;
        const end = Date.now() + duration; // set the end time
        const interval = setInterval(() => {
          if (Date.now() > end) { // if time reached then clear the interval
            clearInterval(interval);
            return this.renderer2.removeChild(this.elementRef.nativeElement, this.canvas); // remove the canvas from the DOM
          }
          const particleCount = 100 * ((end - Date.now()) / duration);
          // since particles fall down, start a bit higher than random
          this.confettiCanvas(Object.assign({}, defaults, { particleCount, origin: { x: this.randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
          this.confettiCanvas(Object.assign({}, defaults, { particleCount, origin: { x: this.randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        // this.confettiCanvas({ // if time hasn't passed then call the start the confetti
        //   particleCount: 100,
        //   spread: 70,
        //   origin: { y: 0.6 }
        // });
      });
  }

  randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
