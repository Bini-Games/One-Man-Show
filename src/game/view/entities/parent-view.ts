import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { Parent } from "../../model/entities/parent";
import { GameConfig } from "../../data/game-config";
import { AbstractEntityView } from "./entity-view";

export class ParentView extends AbstractEntityView<Parent> {
  protected dangerZoneView: Graphics = null;
  protected debugView: Graphics = null;
  protected shadow: Graphics = null;
  protected view: Sprite = null;

  public addTo(parent: Container): void {
    parent.addChild(this.dangerZoneView);
    parent.addChild(this.debugView);
    parent.addChild(this.shadow);
    parent.addChild(this.view);
  }

  protected setViewPosition(x: number, y: number): void {
    this.dangerZoneView.position.set(x, y);
    this.debugView.position.set(x, y);
    this.view.position.set(x, y);
    this.shadow.position.set(x, y + 40);
  }

  public init(): void {
    this.initDangerZoneView();
    this.initDebugView();
    this.initShadow();
    this.initView();
    this.initAnimator(this.view);

    this.dangerZoneView.visible = GameConfig.DebugView;
    this.debugView.visible = GameConfig.DebugView;
  }

  protected initDangerZoneView(): void {
    const parent = this.entity;
    const dangerZoneView = new Graphics();
    this.dangerZoneView = dangerZoneView;

    dangerZoneView.beginFill(0xff0000, 0.2);
    dangerZoneView.drawCircle(0, 0, parent.getDangerRadius() * GameConfig.ViewScale);
    dangerZoneView.endFill();
  }

  protected initDebugView(): void {
    const parent = this.entity;
    const view = new Graphics();
    this.debugView = view;

    view.beginFill(0xffff00, 0.2);
    view.drawCircle(0, 0, parent.getTargetAffectionRadius() * GameConfig.ViewScale);
    view.endFill();

    view.beginFill(0xff0000);
    view.drawCircle(0, 0, parent.getRadius() * GameConfig.ViewScale);
    view.endFill();
  }

  protected initShadow(): void {
    this.shadow = this.createShadow(30, 10);
  }

  protected initView(): void {
    const view = new Sprite(Assets.cache.get("character:mother"));
    this.view = view;
    view.anchor.set(0.5, 0.6);
    view.scale.set(0.1);
  }
}
