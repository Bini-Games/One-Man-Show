import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { Child } from "../../model/entities/child";
import { GameConfig } from "../../data/game-config";
import { AbstractEntityView } from "./entity-view";

export class ChildView extends AbstractEntityView<Child> {
  protected debugView: Graphics = null;
  protected shadow: Graphics = null;
  protected view: Sprite = null;

  public addTo(parent: Container): void {
    parent.addChild(this.debugView);
    parent.addChild(this.shadow);
    parent.addChild(this.view);
  }

  protected setViewPosition(x: number, y: number): void {
    this.debugView.position.set(x, y);
    this.view.position.set(x, y);
    this.shadow.position.set(x, y + 30);
  }

  public init(): void {
    this.initDebugView();
    this.initShadow();
    this.initView();

    this.debugView.visible = GameConfig.DebugView;
  }

  protected initDebugView(): void {
    const child = this.entity;
    const view = new Graphics();
    this.debugView = view;

    view.beginFill(0xffff00, 0.2);
    view.drawCircle(0, 0, child.getTargetAffectionRadius() * GameConfig.ViewScale);
    view.endFill();

    view.beginFill(0x0000ff);
    view.drawCircle(0, 0, child.getRadius() * GameConfig.ViewScale);
    view.endFill();
  }

  protected initShadow(): void {
    this.shadow = this.createShadow(20, 7);
  }

  protected initView(): void {
    const view = new Sprite(Assets.cache.get("character:daughter"));
    this.view = view;
    view.anchor.set(0.5, 0.6);
    view.scale.set(0.07);
  }
}
