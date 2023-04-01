import * as assert from "typed-assert";
import { AbstractService } from "../services/abstract-service";

export class Logger extends AbstractService {
  public static readonly key: string = "Logger";

  constructor() {
    super(Logger.key);
  }

  public log(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }

  public warn(message?: any, ...optionalParams: any[]): void {
    console.warn(message, ...optionalParams);
  }

  public error(message?: any, ...optionalParams: any[]): void {
    console.error(message, ...optionalParams);
  }

  public fail(message?: any, ...optionalParams: any[]): void {
    this.error(message, ...optionalParams);
    assert.assert(false, message);
  }
}
