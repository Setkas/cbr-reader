import {Component, ViewEncapsulation} from '@angular/core';
import {LoggerProvider} from "../../providers/logger-provider";
import {FlashProvider, FlashEvents, FlashEventInterface, FlashParamsInterface} from "./flash-provider";
import Timer = NodeJS.Timer;

/**
 * Flash messages data interface
 */
export interface FlashDataInterface {
  id: number,
  content: string,
  type: string,
  shown: boolean,
  timeout: Timer
}

@Component({
  selector: 'flash-component',
  templateUrl: 'flash-component.html',
  styleUrls: ['flash-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlashComponent {
  /**
   * Modal data to show on screen
   * @type {FlashDataInterface[]}
   */
  public flashData: FlashDataInterface[] = [];

  /**
   * Duration of flash message display in seconds
   * @type {number}
   */
  private displayDuration: number = 5;

  /**
   * Constructor
   */
  constructor(flash: FlashProvider) {
    flash.$events.subscribe((event: FlashEventInterface) => {
      this.eventReaction(event);
    });
  }

  /**
   * Event from provider callback
   * @param event
   */
  private eventReaction(event: FlashEventInterface): void {
    switch (event.type) {
      case FlashEvents.show:
        this.show(event.options);

        break;

      case FlashEvents.hide:
        this.hide();

        break;

      default:
        LoggerProvider.Error("[FLASH]: Cannot decode received event.");
    }
  }

  /**
   * Shows flash message if not already shown
   * @param options
   * @return {boolean}
   */
  private show(options: FlashParamsInterface): boolean {
    if (options) {
      this.loadOptions(options);

      return true;
    } else {
      LoggerProvider.Warning("[FLASH]: Cannot show flash message, no options specified.");

      return false;
    }
  }

  /**
   * Hide flash message if shown on screen
   * @return {boolean}
   */
  private hide(): void {
    this.flashData.forEach((flash: FlashDataInterface) => {
      this.removeMessage(flash.id)
    });
  }

  /**
   * Loads options to display flash message
   * @param options
   */
  private loadOptions(options: FlashParamsInterface): void {
    let uId: number = Date.now(),
      duplicate: number|null = this.checkDuplicate(options.content, options.type || "danger");

    if (duplicate !== null) {
      this.removeMessage(this.flashData[duplicate].id);
    }

    this.flashData.push({
      id: uId,
      content: options.content,
      type: "alert-" + (options.type || "danger"),
      shown: true,
      timeout: setTimeout(() => {
        this.removeMessage(uId);
      }, this.displayDuration * 1000)
    });
  }

  /**
   * Removes single flash message display
   * @param uId
   * @return {boolean}
   */
  public removeMessage(uId: number): boolean {
    let index: number = null;

    this.flashData.forEach((flash: FlashDataInterface, key: number) => {
      if (flash.id === uId) {
        index = key;
      }
    });

    if (index !== null) {
      clearTimeout(this.flashData[index].timeout);

      this.flashData[index].shown = false;

      return true;
    } else {
      LoggerProvider.Error("[FLASH]: Unable to find specified uid.");

      return false;
    }
  }

  /**
   * Checks for already existing flash message
   * @param content
   * @param type
   * @return {number}
   */
  private checkDuplicate(content, type): number|null {
    let index: number = null;

    this.flashData.forEach((flash: FlashDataInterface, key: number) => {
      if (flash.content === content && flash.type === "alert-" + type && flash.shown === true) {
        index = key;
      }
    });

    return index;
  }
}
