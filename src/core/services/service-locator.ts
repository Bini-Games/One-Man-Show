import * as assert from "typed-assert";
import { AbstractService } from "./abstract-service";

export class ServiceLocator {
  protected services: Record<string, any> = {};

  constructor() {}

  public registerService<T extends AbstractService>(
    key: string,
    service: T
  ): T {
    assert.isString(key);
    assert.isNotVoid(service);
    this.services[key] = service;
    return service;
  }

  public hasService(key: string): boolean {
    assert.isString(key);
    return !!this.services[key];
  }

  public getService<T extends AbstractService>(key: string): T {
    assert.isString(key);
    return this.services[key] || null;
  }
}
