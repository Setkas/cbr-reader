import {Component, ViewEncapsulation, ViewChild, OnInit} from '@angular/core';
import {LoggerProvider} from "../../providers/logger-provider";
import {
  ModalProvider,
  ModalEvents,
  ModalEventsInterface,
  ModalParamsInterface,
  ModalButtonParamsInterface
} from "./modal-provider";
import {ModalDirective} from "ng2-bootstrap";

/**
 * Modal data interface
 */
export interface ModalDataInterface {
  title: string,
  content: string,
  className: string,
  buttons: {
    text: string,
    className: string,
    callback: Function
  }[],
  closeOnClick: boolean
}

@Component({
  selector: 'modal-component',
  templateUrl: 'modal-component.html',
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit {
  /**
   * Modal data to show on screen
   * @type {ModalDataInterface}
   */
  public modalData: ModalDataInterface = {
    closeOnClick: false,
    title: "",
    content: "",
    className: "",
    buttons: []
  };

  /**
   * Indicates whether modal is shown
   * @type {boolean}
   */
  private isShown: boolean = false;

  /**
   * Modal HTML element
   * @type {ModalDirective}
   */
  @ViewChild('modalComponentModal') private modalComponentModal: ModalDirective;

  /**
   * Constructor
   * @param modal
   */
  constructor(modal: ModalProvider) {
    modal.$events.subscribe((type: ModalEventsInterface) => {
      this.eventReaction(type);
    });
  }

  /**
   * DOM ready event callback
   */
  ngOnInit() {
    this.setupEvents();
  }

  /**
   * Setups all modal event callbacks
   */
  private setupEvents(): void {
    this.modalComponentModal.onHidden.subscribe(() => {
      this.modalData = {
        closeOnClick: false,
        title: "",
        content: "",
        className: "",
        buttons: []
      };
    });

    this.modalComponentModal.onShow.subscribe(() => {
      this.isShown = true;
    });

    this.modalComponentModal.onHide.subscribe(() => {
      this.isShown = false;
    });
  }

  /**
   * Event from provider callback
   * @param event
   */
  private eventReaction(event: ModalEventsInterface): void {
    switch (event.type) {
      case ModalEvents.show:
        this.show(event.options);

        break;

      case ModalEvents.hide:
        this.hide();

        break;

      default:
        LoggerProvider.Error("[MODAL]: Cannot decode received event.");
    }
  }

  /**
   * Shows loader if not already shown
   * @param options
   * @return {boolean}
   */
  private show(options: ModalParamsInterface): boolean {
    if (!this.isShown) {
      this.loadOptions(options);

      this.modalComponentModal.show();

      return true;
    } else {
      LoggerProvider.Warning("[MODAL]: Cannot show loader, because it is already shown.");

      return false;
    }
  }

  /**
   * Hide loader if shown on screen
   * @return {boolean}
   */
  private hide(): boolean {
    if (this.isShown) {
      this.modalComponentModal.hide();

      return true;
    } else {
      LoggerProvider.Warning("[MODAL]: Cannot hide modal, because it is not shown.");

      return false;
    }
  }

  /**
   * Loads options to display modal
   * @param options
   */
  private loadOptions(options: ModalParamsInterface): void {
    this.modalData.title = options.title;

    this.modalData.content = options.content;

    this.modalData.closeOnClick = options.closeOnClick || true;

    this.modalData.className = options.className || "";

    if (options.buttons) {
      let defaultCallback: Function = (modal: ModalDirective) => {
        modal.hide()
      };

      this.modalData.buttons = [];

      options.buttons.forEach((button: ModalButtonParamsInterface) => {
        this.modalData.buttons.push({
          text: button.text,
          className: button.className || "",
          callback: button.callback || defaultCallback
        });
      });
    } else {
      this.modalData.buttons = [];
    }
  }
}
