import {Injectable, EventEmitter} from '@angular/core';

/**
 * Flash message parameters interface
 */
export interface FlashParamsInterface {
  content: string,
  type?: string
}

/**
 * Communication event interface
 */
export interface FlashEventInterface {
  type: number,
  options?: FlashParamsInterface
}

/**
 * Possible events emitted from provider
 * @type {{show: number, hide: number}}
 */
export const FlashEvents: {show: number, hide: number} = {
  show: 0,
  hide: 1
};

@Injectable()
export class FlashProvider {
  /**
   * Events for component
   * @type {EventEmitter<FlashEventInterface>}
   */
  public $events: EventEmitter<FlashEventInterface> = new EventEmitter<FlashEventInterface>();

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Show modal on screen
   */
  public show(options: FlashParamsInterface): void {
    this.$events.emit({
      type: FlashEvents.show,
      options: options
    });
  }

  /**
   * Hide modal from screen
   */
  public hide(): void {
    this.$events.emit({
      type: FlashEvents.hide
    });
  }
}
