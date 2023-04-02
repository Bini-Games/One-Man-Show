import { Assets, Container, Sprite } from "pixi.js";
import { Map } from "../model/map";
import { WallView } from "./entities/obstacles/wall-view";
import { GameConfig } from "../data/game-config";

export class MapView {
  protected container: Container = null;

  protected map: Map = null;

  protected obstaclesViews: WallView[] = [];

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
      this.setupGameObjectView(new WallView(obstacle));
    }
  }

  protected setupGameObjectView(view: WallView): WallView {
    this.obstaclesViews.push(view);
    view.init();
    view.addTo(this.container);
    return view;
  }
}
