import { Container, Graphics } from "pixi.js";
import { Parent } from "../model/parent";
import { GameConfig } from "../data/game-config";
import { AbstractEntityView } from "./entity-view";

export class ParentView extends AbstractEntityView<Parent> {
  protected affectionZoneView: Graphics = null;
  protected view: Graphics = null;

  public addTo(parent: Container): void {
    parent.addChild(this.affectionZoneView);
    parent.addChild(this.view);
  }

  protected setViewPosition(x: number, y: number): void {
    this.affectionZoneView.position.set(x, y);
    this.view.position.set(x, y);
  }

  public init(): void {
    this.initAffectionZoneView();
    this.initView();
  }

  protected initAffectionZoneView(): void {
    const parent = this.entity;
    const affectionZoneView = new Graphics();
    affectionZoneView.beginFill(0xff0000, 0.2);
    affectionZoneView.drawCircle(0, 0, parent.getAffectRadius() * GameConfig.ViewScale);
    affectionZoneView.endFill();
    this.affectionZoneView = affectionZoneView;
  }

  protected initView(): void {
    const parent = this.entity;
    const view = new Graphics();
    view.beginFill(0xff0000);
    view.drawCircle(0, 0, parent.getRadius() * GameConfig.ViewScale);
    view.endFill();
    this.view = view;
  }
}
