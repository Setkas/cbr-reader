import {Directive, ElementRef, Input, OnChanges, SimpleChanges, OnInit} from "@angular/core";

declare const $: any;

@Directive({
  selector: '[fadeToggle]'
})
export class FadeToggleComponent implements OnChanges, OnInit {
  /**
   * Decides whether to show or not
   * @type {boolean}
   */
  @Input() private fadeToggle: boolean = true;

  /**
   * Initial duration of animation
   * @type {number}
   */
  @Input() private initialDuration: number = 0;

  /**
   * Duration of the entire animation
   * @type {number}
   */
  @Input() private animationDuration: number = 500;

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

    FadeToggleComponent.Animate(element, this.initialDuration, this.fadeToggle);

    this.ready = true;
  }

  /**
   * On input change event
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.ready) {
      let element: any = this.elementRef.nativeElement;

      FadeToggleComponent.Animate(element, this.animationDuration, this.fadeToggle);
    }
  }

  /**
   * Animation function for jQuery slide and opacity
   * @param element
   * @param duration
   * @param result
   */
  private static Animate(element: any, duration: number, result: boolean) {
    if (result === true) {
      $(element).fadeIn(duration);
    } else {
      $(element).fadeOut(duration);
    }
  }
}
