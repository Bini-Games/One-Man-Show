import { ServiceLocator } from "../services/service-locator";
import { EventBus } from "./event-bus";
import { Logger } from "./logger";

export class GameClass extends ServiceLocator {
  public get logger(): Logger {
    return this.getService(Logger.key);
  }
  
  public get events(): EventBus {
    return this.getService(EventBus.key);
  }
}

export const Game = new GameClass();
