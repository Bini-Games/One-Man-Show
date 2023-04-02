import { AbstractService } from "../services/abstract-service";

export class EventBus extends AbstractService {
  public static readonly key: string = "EventBus";

  constructor() {
    super(EventBus.key);
  }
}
