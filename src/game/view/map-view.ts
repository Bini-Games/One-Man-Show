import { Container } from "pixi.js";
import { Map } from "../model/map";
import { WallView } from "./entities/obstacles/wall-view";

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
