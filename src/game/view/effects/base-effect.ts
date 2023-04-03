import { Emitter } from "@pixi/particle-emitter";
import { Container } from "pixi.js";
import { Game } from "../../../core/facade/game";

export class BaseEffect {
  protected container: Container = null;
  protected emitter: Emitter = null;

  constructor(container: Container) {
    this.container = container;
  }

  public init(): void {
    this.initEmitter();
    this.listenEvents();
  }

  public emitAt(x: number, y: number): void {
    this.emitter.spawnPos.set(x, y);
    this.emitter.emit = true;
  }

  protected initEmitter(): void {}

  protected listenEvents(): void {
    Game.events.on("update", this.update, this);
  }

  protected update(dt: number) {
    this.emitter.update(dt);
  }
}
