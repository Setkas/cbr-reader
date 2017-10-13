import {Directive, ElementRef, Input, OnChanges, SimpleChanges, OnInit, EventEmitter, Output} from "@angular/core";

declare const $: any;

@Directive({
  selector: '[slideToggle]'
})
export class SlideToggleComponent implements OnChanges, OnInit {
  /**
   * Decides whether to show or not
   * @type {boolean}
   */
  @Input() private slideToggle: boolean = true;

  /**
   * Initial duration of animation
   * @type {number}
   */
  @Input() private initialDuration: number = 0;

  /**
   * Decides whether to animate opactiy as well
   * @type {boolean}
   */
  @Input() private toggleOpacity: boolean = true;

  /**
   * Duration of the entire animation
   * @type {number}
   */
  @Input() private animationDuration: number = 500;

  /**
   * On animation complete event
   * @type {EventEmitter<void>}
   */
  @Output() public onComplete: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Indicates whether element is ready
   * @type {boolean}
   */
  private ready: boolean = false;

  /**
   * Constructor
   */
  constructor(private elementRef: ElementRef) {

  }

  /**
   * DOM Init Callback
   */
  ngOnInit() {
    let element: any = this.elementRef.nativeElement;

    if (this.slideToggle) {
      this.animate(element, "down", this.initialDuration, (this.toggleOpacity) ? 0 : 1, 1);
    } else {
      this.animate(element, "up", this.initialDuration, 1, (this.toggleOpacity) ? 0 : 1);
    }

    this.ready = true;
  }

  /**
   * On input change event
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.ready) {
      let element: any = this.elementRef.nativeElement;

      if (this.slideToggle) {
        this.animate(element, "down", this.animationDuration, (this.toggleOpacity) ? 0 : 1, 1);
      } else {
        this.animate(element, "up", this.animationDuration, 1, (this.toggleOpacity) ? 0 : 1);
      }
    }
  }

  /**
   * Animation function for jQuery slide and opacity
   * @param element
   * @param direction
   * @param duration
   * @param opacityStart
   * @param opacityEnd
   */
  private animate(element: any, direction: string, duration: number, opacityStart: number, opacityEnd: number) {
    let func: string = (direction === "up") ? "slideUp" : "slideDown";


    $(element).css('opacity', opacityStart)[func](duration).animate(
      {
        opacity: opacityEnd
      },
      {
        queue: false,
        duration: duration,
        complete: () => {
          this.onComplete.emit();
        }
      }
    );
  }
}
