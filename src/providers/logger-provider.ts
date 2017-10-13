import {Injectable} from '@angular/core';
import {AppVariables} from "../app/variables";

/**
 * Logging class definition
 */
@Injectable()
export class LoggerProvider {
  /**
   * Use logging in general
   * @type {boolean}
   */
  private logUse: boolean = AppVariables.useLog;

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Perform logging to console
   * @param type
   * @param message
   * @returns {boolean}
   */
  private consoleLog(type: string, message: any): boolean {
    let allowedTypes: string[] = ['log', 'error', 'warning'];

    if (allowedTypes.indexOf(type) === -1) {
      this.consoleLog('warning', "Invalid log type detected, ignoring action...");
      return false;
    }

    type = (type === "warning") ? "warn" : type;

    console[type](message);

    return true;
  }

  /**
   * Actual logging operation start
   * @param type
   * @param params
   * @returns {boolean}
   */
  private logCrossRoad(type: string, params: any[]): boolean {
    if (this.logUse === false) {
      return false;
    }

    params.forEach((value) => {
      this.consoleLog(type, value);
    });

    return true;
  }

  /**
   * Logging with debug or info purposes
   * @param params
   */
  static Log(...params: any[]): void {
    let log = new this();

    log.logCrossRoad('log', params);
  }

  /**
   * Logging with warning purposes
   * @param params
   */
  static Warning(...params: any[]): void {
    let log = new this();

    log.logCrossRoad('warning', params);
  }

  /**
   * Logging with error purposes
   * @param params
   */
  static Error(...params: any[]): void {
    let log = new this();

    log.logCrossRoad('error', params);
  }
}
