import { Container } from "pixi.js";
import { ChildView } from "./entities/child-view";
import { ParentView } from "./entities/parent-view";
import { TargetView } from "./entities/target-view";
import { AbstractEntityView } from "./entities/entity-view";
import { AbstractService } from "../../core/services/abstract-service";
import { World } from "../model/world";

export class WorldView extends AbstractService {
  public static readonly key: string = "WorldView";

  protected container: Container = null;

  protected world: World = null;

  protected childView: ChildView = null;
  protected parentView: ParentView = null;
  protected targetView: TargetView = null;

  constructor(world: World) {
    super(WorldView.key);

    this.world = world;
  }

  public getContainer(): Container {
    return this.container;
  }

  public init(): void {
    this.initContainer();
    this.initChildView();
    this.initParentView();
    this.initTargetView();
  }

  public update(): void {
    this.childView.update();
    this.parentView.update();
    this.targetView.update();
  }

  protected initContainer(): void {
    this.container = new Container();
  }

  protected initChildView(): void {
    this.childView = this.setupGameObjectView(new ChildView(this.world.getChild()));
  }

  protected initParentView(): void {
    this.parentView = this.setupGameObjectView(new ParentView(this.world.getParent()));
  }

  protected initTargetView(): void {
    this.targetView = this.setupGameObjectView(new TargetView(this.world.getTarget()));
  }

  protected setupGameObjectView<ViewType extends AbstractEntityView>(view: ViewType): ViewType {
    view.init();
    view.addTo(this.container);
    return view;
  }
}
