import { Container, Graphics } from "pixi.js";
import { Target } from "../model/target";
import { GameConfig } from "../data/game-config";
import { AbstractEntityView } from "./entity-view";

export class TargetView extends AbstractEntityView<Target> {
  protected view: Graphics;

  public addTo(parent: Container): void {
    parent.addChild(this.view);
  }

  protected setViewPosition(x: number, y: number): void {
    this.view.position.set(x, y);
  }

  protected initView(): void {
    const target = this.entity;
    const view = new Graphics();
    view.beginFill(0x00ff00);
    view.drawCircle(0, 0, target.getRadius() * GameConfig.WorldScale);
    view.endFill();
    this.view = view;
  }
}
