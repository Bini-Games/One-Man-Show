import * as Matter from "matter-js";
import { ActionType } from "./action-type.enum";
import { Child } from "./child";
import { Parent } from "./parent";
import { Target } from "./target";
import { GameEntity } from "./game-entity";
import { AbstractService } from "../../core/services/abstract-service";
import { GameConfig } from "../data/game-config";

export class World extends AbstractService {
  public static readonly key: string = "World";
  public static readonly timeStep: number = 1 / 60;
  public static readonly physicsTimeStep: number = World.timeStep * 1000;
  public static readonly statesCount: number = 8;
  public static readonly actionsCount: number = 5; // move left, right, up, down, or stand

  protected physicsEngine: Matter.Engine;
  protected physicsWorld: Matter.World;
  protected child: Child;
  protected parent: Parent;
  protected target: Target;

  constructor() {
    super(World.key);
  }

  public getChild(): Child {
    return this.child;
  }

  public getParent(): Parent {
    return this.parent;
  }

  public getTarget(): Target {
    return this.target;
  }

  public reset(): void {
    const worldSize = GameConfig.WorldSize;
    const child = this.child;
    child.reset();
    child.setPosition(Math.random() * worldSize, Math.random() * worldSize);

    const parent = this.parent;
    parent.reset();
    parent.setPosition(Math.random() * worldSize, Math.random() * worldSize);

    const target = this.target;
    target.reset();
    target.setPosition(Math.random() * worldSize, Math.random() * worldSize);
  }

  public getState(): number[] {
    const child = this.child;
    const target = this.target;
    const parent = this.parent;

    const childPosition = child.getPosition();
    const childVelocity = child.getVelocity();

    const worldSize = GameConfig.WorldSize;
    const worldSizeInv = 1 / worldSize;

    const childToTarget = target
      .getPosition()
      .clone()
      .sub(childPosition);

    const childToParent = parent
      .getPosition()
      .clone()
      .sub(childPosition);

    return [
      childPosition.x * worldSizeInv - 0.5,
      childPosition.y * worldSizeInv - 0.5,
      childVelocity.x * worldSizeInv * 10,
      childVelocity.y * worldSizeInv * 10,
      childToTarget.x * worldSizeInv,
      childToTarget.y * worldSizeInv,
      childToParent.x * worldSizeInv,
      childToParent.y * worldSizeInv,
    ];
  }

  public doAction(action: ActionType): void {
  }

  public getReward(): number {
    const child = this.child;
    const target = this.target;
    const parent = this.parent;

    const childPosition = child.getPosition();

    const childToTargetDistance = target
      .getPosition()
      .clone()
      .sub(childPosition)
      .getLength();

    const childToParentDistance = parent
      .getPosition()
      .clone()
      .sub(childPosition)
      .getLength();

    // it's better to be as close to the target as it's possible
    let reward = -childToTargetDistance;

    // but if we're too close to parent - that's bad
    const affectRadius = parent.getAffectRadius();
    if (childToParentDistance < affectRadius) {
      const childToParentDistanceMultiplier = 2;
      const childToParentDistanceCoefficient =
        (childToParentDistance - affectRadius) / affectRadius;

      reward +=
        childToParentDistanceCoefficient * childToParentDistanceMultiplier;
    }

    return reward;
  }

  public getNumStates(): number {
    return World.statesCount;
  }

  public getMaxNumActions(): number {
    return World.actionsCount;
  }

  public fixedUpdate() {
    Matter.Engine.update(this.physicsEngine, World.physicsTimeStep);
  }

  public init(): void {
    this.initPhysics();
    this.initChild();
    this.initParent();
    this.initTarget();
  }

  protected initPhysics(): void {
    const engine = Matter.Engine.create({
      gravity: {
        y: 0,
      },
    });
    this.physicsEngine = engine;
    this.physicsWorld = engine.world;
  }

  protected initChild(): void {
    this.child = this.setupGameEntity(new Child());
  }

  protected initParent(): void {
    this.parent = this.setupGameEntity(new Parent());
  }

  protected initTarget(): void {
    this.target = this.setupGameEntity(new Target());
  }

  protected setupGameEntity<EntityType extends GameEntity>(gameEntity: EntityType): EntityType {
    gameEntity.init();
    gameEntity.addToPhysicsWorld(this.physicsWorld);
    return gameEntity;
  }
}
