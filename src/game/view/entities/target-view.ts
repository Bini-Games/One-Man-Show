import { Assets, Container, Graphics, Sprite, Texture } from "pixi.js";
import { Target } from "../../model/entities/target";
import { GameConfig } from "../../data/game-config";
import { AbstractEntityView } from "./entity-view";
import { TargetType } from "../../model/entities/target-type.enum";
import { Game } from "../../../core/facade/game";

export class TargetView extends AbstractEntityView<Target> {
  protected debugView: Graphics = null;
  protected view: Sprite = null;

  public addTo(parent: Container): void {
    parent.addChild(this.debugView);
    parent.addChild(this.view);
  }

  protected setViewPosition(x: number, y: number): void {
    this.debugView.position.set(x, y);
    this.view.position.set(x, y);
  }

  public init(): void {
    this.initDebugView();
    this.initView();
    this.listenEvents();

    this.debugView.visible = GameConfig.DebugView;
  }

  protected initDebugView(): void {
    const target = this.entity;
    const view = new Graphics();
    this.debugView = view;

    view.beginFill(0x00ff00);
    view.drawCircle(0, 0, target.getRadius() * GameConfig.ViewScale);
    view.endFill();
  }

  protected initView(): void {
    const view = new Sprite(this.getTextureOk());
    this.view = view;
    view.anchor.set(0.5);
    view.scale.set(this.getViewScale());
  }

  protected listenEvents(): void {
    Game.events.on("gameplay:target_broken_changed", this.onTargetBrokenStateChanged, this);
  }

  protected getTextureOk(): Texture {
    const type = this.entity.type;

    switch (type) {
      case TargetType.TeddyBear:
        return Assets.cache.get("map:teddy_bear:ok");
      case TargetType.Train:
        return Assets.cache.get("map:train:ok");
      case TargetType.Doll:
        return Assets.cache.get("map:doll:ok");
      case TargetType.Ball:
        return Assets.cache.get("map:ball:ok");
    }
  }

  protected getTextureBroken(): Texture {
    const type = this.entity.type;

    switch (type) {
      case TargetType.TeddyBear:
        return Assets.cache.get("map:teddy_bear:broken");
      case TargetType.Train:
        return Assets.cache.get("map:train:broken");
      case TargetType.Doll:
        return Assets.cache.get("map:doll:broken");
      case TargetType.Ball:
        return Assets.cache.get("map:ball:ok");
    }
  }

  protected getViewScale(): number {
    const type = this.entity.type;

    switch (type) {
      case TargetType.TeddyBear:
        return 0.08;
      case TargetType.Train:
        return 0.08;
      case TargetType.Doll:
        return 0.08;
      case TargetType.Ball:
        return 0.125;
    }
  }

  protected onTargetBrokenStateChanged(target: Target): void {
    if (this.entity !== target) {
      return;
    }

    const newTexture = target.isBroken() ? this.getTextureBroken() : this.getTextureOk();
    const view = this.view;

    if (view.texture !== newTexture) {
      view.texture = newTexture;
    }
  }
}
