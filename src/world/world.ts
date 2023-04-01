import { Child } from "./child";
import { Parent } from "./parent";
import { Target } from "./target";

export class World {
  public static readonly statesCount: number = 8;
  public static readonly actionsCount: number = 5; // move left, right, up, down, or stay

  public child: Child;
  public parent: Parent;
  public target: Target;

  constructor() {
    this.init();
    this.reset();
  }

  public reset(): void {
    const child = this.child;
    child.position.set(Math.random(), Math.random());
    child.velocity.set(
      Math.random() * 0.05 - 0.025,
      Math.random() * 0.05 - 0.025
    );

    const parent = this.parent;
    parent.position.set(Math.random(), Math.random());
    parent.velocity.set(0);

    const target = this.target;
    target.position.set(Math.random(), Math.random());
  }

  public getState(): number[] {
    const child = this.child;
    const target = this.target;
    const parent = this.parent;

    const childToTarget = target.position.clone().sub(child.position);
    const childToParent = parent.position.clone().sub(child.position);

    return [
      child.position.x - 0.5,
      child.position.y - 0.5,
      child.velocity.x * 10,
      child.velocity.y * 10,
      childToTarget.x,
      childToTarget.y,
      childToParent.x,
      childToParent.y,
    ];
  }

  public doAction(action: number): void {
  }

  public getReward(): number {
    const child = this.child;
    const target = this.target;
    const parent = this.parent;

    const childToTargetDistance = target.position
      .clone()
      .sub(child.position)
      .getLength();

    const childToParentDistance = parent.position
      .clone()
      .sub(child.position)
      .getLength();

    // it's better to be as close to the target as it's possible
    let reward = -childToTargetDistance;

    // but if we're too close to parent - that's bad
    const affectRadius = parent.affectRadius;
    if (childToParentDistance < affectRadius) {
      const childToParentDistanceMultiplier = 2;
      const childToParentDistanceCoefficient =
        (childToParentDistance - affectRadius) / affectRadius;

      reward +=
        childToParentDistanceCoefficient * childToParentDistanceMultiplier;
    }

    return reward;
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
