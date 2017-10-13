import {Component, ViewEncapsulation, ElementRef} from '@angular/core';
import {LoggerProvider} from "../../providers/logger-provider";
import {LoaderProvider, LoaderEvents} from "./loader-provider";

@Component({
  selector: 'loader-component',
  templateUrl: 'loader-component.html',
  encapsulation: ViewEncapsulation.None
})
export class LoaderComponent {
  /**
   * Constructor
   * @param element
   * @param loader
   */
  constructor(private element: ElementRef,
              loader: LoaderProvider) {
    loader.$events.subscribe((type: number) => {
      this.eventReaction(type);
    });
  }

  /**
   * Event from provider callback
   * @param event
   */
  private eventReaction(event: number): void {
    switch (event) {
      case LoaderEvents.show:
        this.show();

        break;

      case LoaderEvents.hide:
        this.hide();

        break;

      default:
        LoggerProvider.Error("[LOADER]: Cannot decode received event.");
    }
  }

  /**
   * Shows loader if not already shown
   * @return {boolean}
   */
  private show(): boolean {
    if (this.element && this.element.nativeElement && this.element.nativeElement.classList) {
      if (!this.element.nativeElement.classList.contains("shown")) {
        this.element.nativeElement.classList.add("shown");

        return true;
      } else {
        LoggerProvider.Warning("[LOADER]: Cannot show loader, because it is already shown.");

        return true;
      }
    } else {
      LoggerProvider.Error("[LOADER]: Cannot get loader component's element instance.");

      return false;
    }
  }

  /**
   * Hide loader if shown on screen
   * @return {boolean}
   */
  private hide(): boolean {
    if (this.element && this.element.nativeElement && this.element.nativeElement.classList) {
      if (this.element.nativeElement.classList.contains("shown")) {
        this.element.nativeElement.classList.remove("shown");

        return true;
      } else {
        LoggerProvider.Warning("[LOADER]: Cannot hide loader, because it is not shown.");

        return false
      }
    } else {
      LoggerProvider.Error("[LOADER]: Cannot get loader component's element instance.");

      return false;
    }
  }
}
