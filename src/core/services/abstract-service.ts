export abstract class AbstractService {
  public readonly serviceKey: string;

  constructor(serviceKey: string) {
    this.serviceKey = serviceKey;
  }

  public getServiceKey(): string {
    return this.serviceKey;
  }
}
