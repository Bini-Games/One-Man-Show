import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { Parent } from "../../model/entities/parent";
import { GameConfig } from "../../data/game-config";
import { AbstractEntityView } from "./entity-view";

export class ParentView extends AbstractEntityView<Parent> {
  protected affectionZoneView: Graphics = null;
  protected debugView: Graphics = null;
  protected view: Sprite = null;

  public addTo(parent: Container): void {
    parent.addChild(this.affectionZoneView);
    parent.addChild(this.debugView);
    parent.addChild(this.view);
  }

  protected setViewPosition(x: number, y: number): void {
    this.affectionZoneView.position.set(x, y);
    this.debugView.position.set(x, y);
    this.view.position.set(x, y);
  }

  public init(): void {
    this.initAffectionZoneView();
    this.initDebugView();
    this.initView();

    this.affectionZoneView.visible = GameConfig.DebugView;
    this.debugView.visible = GameConfig.DebugView;
  }

  protected initAffectionZoneView(): void {
    const parent = this.entity;
    const affectionZoneView = new Graphics();
    affectionZoneView.beginFill(0xff0000, 0.2);
    affectionZoneView.drawCircle(0, 0, parent.getAffectRadius() * GameConfig.ViewScale);
    affectionZoneView.endFill();
    this.affectionZoneView = affectionZoneView;
  }

  protected initDebugView(): void {
    const parent = this.entity;
    const view = new Graphics();
    view.beginFill(0xff0000);
    view.drawCircle(0, 0, parent.getRadius() * GameConfig.ViewScale);
    view.endFill();
    this.debugView = view;
  }

  protected initView(): void {
    const view = new Sprite(Assets.cache.get('character:mother'));
    this.view = view;
    view.anchor.set(0.5, 0.6);
    view.scale.set(0.1);
  }
}
