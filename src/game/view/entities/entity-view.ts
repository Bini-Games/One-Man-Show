import { Container, Graphics } from "pixi.js";
import { GameConfig } from "../../data/game-config";
import { GameEntity } from "../../model/entities/game-entity";

export abstract class AbstractEntityView<EntityType extends GameEntity = GameEntity> {
  protected entity: EntityType = null;

  constructor(entity: EntityType) {
    this.entity = entity;
  }

  public abstract addTo(parent: Container): void;

  public update(): void {
    this.updateViewPosition();
  }

  public init(): void {
    this.initView();
  }

  protected abstract  initView(): void;

  protected updateViewPosition(): void {
    const entityPosition = this.entity.getPosition();
    const scale = GameConfig.ViewScale;
    this.setViewPosition(entityPosition.x * scale, entityPosition.y * scale);
  }

  protected abstract setViewPosition(x: number, y: number): void;

  protected createShadow(width: number, height: number): Graphics {
    const shadow = new Graphics();
    shadow.beginFill(0x000000, 0.2);
    shadow.drawEllipse(0, 0, width, height);
    shadow.endFill();
    shadow.cacheAsBitmap = true;
    return shadow;
  }
}
