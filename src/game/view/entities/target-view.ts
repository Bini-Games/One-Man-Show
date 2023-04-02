import { Assets, Container, Graphics, Sprite, Texture } from "pixi.js";
import { Target } from "../../model/entities/target";
import { GameConfig } from "../../data/game-config";
import { AbstractEntityView } from "./entity-view";
import { TargetType } from "../../model/entities/target-type.enum";
import { Game } from "../../../core/facade/game";
import { ProgressBar } from "../shared/progress-bar";
import { World } from "../../model/world";

export class TargetView extends AbstractEntityView<Target> {
  protected debugView: Graphics = null;
  protected view: Sprite = null;
  protected conditionPb: ProgressBar = null;

  public addTo(parent: Container): void {
    parent.addChild(this.debugView);
    parent.addChild(this.view);
    parent.addChild(this.conditionPb);
  }

  protected setViewPosition(x: number, y: number): void {
    this.debugView.position.set(x, y);
    this.view.position.set(x, y);
    this.conditionPb.position.set(x, y - 50);
  }

  public init(): void {
    this.initDebugView();
    this.initView();
    this.initConditionProgressBar();
    this.listenEvents();
    this.onTargetChanged(Game.getService<World>(World.key).getCurrentTarget());

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

  protected initConditionProgressBar(): void {
    const pb = new ProgressBar();
    this.conditionPb = pb;
    pb.init();
    pb.align(0.5);
  }

  protected listenEvents(): void {
    Game.events.on("gameplay:target_changed", this.onTargetChanged, this);
    Game.events.on("gameplay:target_condition_changed", this.onTargetConditionChanged, this);
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

  protected onTargetChanged(target: Target): void {
    this.debugView.alpha = this.entity === target ? 1 : 0.5;
  }

  protected onTargetConditionChanged(target: Target): void {
    if (this.entity !== target) {
      return;
    }

    const progress = target.getCondition() / GameConfig.NormalCondition;
    const conditionPb = this.conditionPb;
    conditionPb.setProgress(progress);
    conditionPb.fillColor = this.getProgressBarColor(progress);
    conditionPb.updateStyle();
  }

  protected getProgressBarColor(progress: number): string {
    if (progress === 1) {
      return "green";
    } else if (progress < 0.33) {
      return "red";
    } else if (progress < 0.66) {
      return "orange";
    } else {
      return "yellow";
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
