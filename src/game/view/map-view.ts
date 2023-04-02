import { Assets, Container, Sprite } from "pixi.js";
import { Map } from "../model/map";
import { WallView } from "./entities/obstacles/wall-view";
import { GameConfig } from "../data/game-config";
import { ObstacleType } from "../model/entities/obstacles/obstacle-type.enum";
import { AbstractEntityView } from "./entities/entity-view";
import { Wall } from "../model/entities/obstacles/wall";
import { Obstacle } from "../model/entities/obstacles/obstacle";

type ObstacleView = AbstractEntityView<Obstacle>;

export class MapView {
  protected container: Container = null;

  protected map: Map = null;

  protected obstaclesViews: ObstacleView[] = [];

  constructor(map: Map) {
    this.map = map;
  }

  public getContainer(): Container {
    return this.container;
  }

  public init(): void {
    this.initContainer();
    this.initBg();
    this.initObstaclesViews();
  }

  public update(): void {
    const obstaclesViews = this.obstaclesViews;

    for (const obstacleView of obstaclesViews) {
      obstacleView.update();
    }
  }

  protected initContainer(): void {
    this.container = new Container();
  }

  protected initBg(): void {
    const bg = new Sprite(Assets.cache.get('map:room_bg'));
    this.container.addChild(bg);
    bg.anchor.set(0.5, 0.525);
    bg.position.set(GameConfig.WorldViewSize * 0.5);
    bg.scale.set(1);
  }

  protected initObstaclesViews(): void {
    const obstacles = this.map.getObstacles();

    for (const obstacle of obstacles) {
      let view: ObstacleView;

      switch (obstacle.type) {
        case ObstacleType.Wall:
          view = new WallView(obstacle as Wall);
          break;
      }

      this.setupGameObjectView(view);
    }
  }

  protected setupGameObjectView(view: ObstacleView): ObstacleView {
    this.obstaclesViews.push(view);
    view.init();
    view.addTo(this.container);
    return view;
  }
}
