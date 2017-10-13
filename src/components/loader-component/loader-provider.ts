import {Injectable, EventEmitter} from '@angular/core';

/**
 * Possible events emitted from provider
 * @type {{show: number, hide: number}}
 */
export const LoaderEvents: {show: number, hide: number} = {
  show: 0,
  hide: 1
};

@Injectable()
export class LoaderProvider {
  /**
   * Events for component
   * @type {EventEmitter<number>}
   */
  public $events: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Show loader on screen
   */
  public show(): void {
    this.$events.emit(LoaderEvents.show);
  }

  /**
   * Hide loader from screen
   */
  public hide(): void {
    this.$events.emit(LoaderEvents.hide);
  }
}
