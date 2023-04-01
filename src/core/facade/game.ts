import { ServiceLocator } from "../services/service-locator";
import { Logger } from "./logger";

export class GameClass extends ServiceLocator {
  public get logger(): Logger {
    return this.getService(Logger.key);
  }
}

export const Game = new GameClass();
