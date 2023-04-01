import EventEmitter from "eventemitter3";

export abstract class AbstractService extends EventEmitter {
  public readonly serviceKey: string;

  constructor(serviceKey: string) {
    super();

    this.serviceKey = serviceKey;
  }

  public getServiceKey(): string {
    return this.serviceKey;
  }
}
