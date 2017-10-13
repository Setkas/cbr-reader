import {Injectable, EventEmitter} from '@angular/core';

/**
 * Modal buttons data interface
 */
export interface ModalButtonParamsInterface {
  text: string,
  className?: string,
  callback?: Function
}

/**
 * Modal parameters interface
 */
export interface ModalParamsInterface {
  title: string,
  content: string,
  className?: string,
  buttons?: ModalButtonParamsInterface[],
  closeOnClick?: boolean
}

/**
 * Communication event interface
 */
export interface ModalEventsInterface {
  type: number,
  options?: ModalParamsInterface
}

/**
 * Possible events emitted from provider
 * @type {{show: number, hide: number}}
 */
export const ModalEvents: {show: number, hide: number} = {
  show: 0,
  hide: 1
};

@Injectable()
export class ModalProvider {
  /**
   * Events for component
   * @type {EventEmitter<number>}
   */
  public $events: EventEmitter<ModalEventsInterface> = new EventEmitter<ModalEventsInterface>();

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Show modal on screen
   * @param options
   */
  public show(options: ModalParamsInterface): void {
    this.$events.emit({
      type: ModalEvents.show,
      options: options
    });
  }

  /**
   * Hide modal from screen
   */
  public hide(): void {
    this.$events.emit({
      type: ModalEvents.hide
    });
  }
}
