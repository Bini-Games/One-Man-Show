import { Container, Graphics } from "pixi.js";
import { Child } from "../model/child";
import { GameConfig } from "../data/game-config";
import { AbstractEntityView } from "./entity-view";

export class ChildView extends AbstractEntityView<Child> {
  protected view: Graphics;

  public addTo(parent: Container): void {
    parent.addChild(this.view);
  }

  protected setViewPosition(x: number, y: number): void {
    this.view.position.set(x, y);
  }

  protected initView(): void {
    const child = this.entity;
    const view = new Graphics();
    view.beginFill(0x0000ff);
    view.drawCircle(0, 0, child.getRadius() * GameConfig.ViewScale);
    view.endFill();
    this.view = view;
  }
}
