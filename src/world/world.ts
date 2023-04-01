import { Child } from "./child";
import { Parent } from "./parent";
import { Target } from "./target";

export class World {
  public child: Child;
  public parent: Parent;
  public target: Target;

  constructor() {
    this.init();
  }

  public reset(): void {
    const child = this.child;
    child.position.set(Math.random(), Math.random());
    child.velocity.set(Math.random() * 0.05 - 0.025, Math.random() * 0.05 - 0.025);

    const parent = this.parent;
    parent.position.set(Math.random(), Math.random());
    parent.velocity.set(0);

    const target = this.target;
    target.position.set(Math.random(), Math.random());
  }

  protected init(): void {
    this.initChild();
    this.initParent();
    this.initTarget();
  }

  protected initChild(): void {
    this.child = new Child();
  }

  protected initParent(): void {
    this.parent = new Parent();
  }

  protected initTarget(): void {
    this.target = new Target();
  }
}

