import { ServiceLocator } from "../services/service-locator";
import { EventBus } from "./event-bus";
import { Logger } from "./logger";
import { Layout } from "../screen/layout";

export class GameClass extends ServiceLocator {
  public get logger(): Logger {
    return this.getService(Logger.key);
  }

  public get events(): EventBus {
    return this.getService(EventBus.key);
  }

  public get layout(): Layout {
    return this.getService(Layout.key);
  }
}

export const Game = new GameClass();
