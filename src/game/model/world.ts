import * as Matter from "matter-js";
import { ActionType } from "./action-type.enum";
import { Child } from "./entities/child";
import { Parent } from "./entities/parent";
import { Target } from "./entities/target";
import { GameEntity } from "./entities/game-entity";
import { AbstractService } from "../../core/services/abstract-service";
import { GameConfig } from "../data/game-config";
import { Vector2, Vector2Pool } from "../../core/math/vector2";
import { Map } from "./map";

export class World extends AbstractService {
  public static readonly key: string = "World";
  public static readonly timeStep: number = 1 / 60;
  public static readonly physicsTimeStep: number = World.timeStep * 1000;
  public static readonly statesCount: number = 8;
  public static readonly actionsCount: number = 5; // move left, right, up, down, or stand

  protected physicsEngine: Matter.Engine = null;
  protected physicsWorld: Matter.World = null;
  protected map: Map = null;
  protected child: Child = null;
  protected parent: Parent = null;
  protected target: Target = null;
  protected actionVelocities: Record<ActionType, Vector2> = {
    [ActionType.Left]: new Vector2(-1, 0),
    [ActionType.Right]: new Vector2(1, 0),
    [ActionType.Up]: new Vector2(0, -1),
    [ActionType.Down]: new Vector2(0, 1),
    [ActionType.Stand]: new Vector2(0, 0),
  };

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

  public getMap(): Map {
    return this.map;
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

    const result = [
      childPosition.x * worldSizeInv - 0.5,
      childPosition.y * worldSizeInv - 0.5,
      childVelocity.x * worldSizeInv * 10,
      childVelocity.y * worldSizeInv * 10,
      childToTarget.x * worldSizeInv,
      childToTarget.y * worldSizeInv,
      childToParent.x * worldSizeInv,
      childToParent.y * worldSizeInv,
    ];

    Vector2Pool.release(childToTarget);
    Vector2Pool.release(childToParent);

    return result;
  }

  public doAction(action: ActionType): void {
    const velocity = this.actionVelocities[action];
    const speed = GameConfig.ChildSpeed;
    this.child.setVelocity(velocity.x * speed, velocity.y * speed);
  }

  public getReward(): number {
    const child = this.child;
    const target = this.target;
    const parent = this.parent;

    const childPosition = child.getPosition();

    const childToTarget = target
      .getPosition()
      .clone()
      .sub(childPosition);

    const childToParent = parent
      .getPosition()
      .clone()
      .sub(childPosition);

    const worldSizeInv = 1 / GameConfig.WorldSize;
    const childToParentDistance = childToParent.getLength() * worldSizeInv;
    const childToTargetDistance = childToTarget.getLength() * worldSizeInv;

    // it's better to be as close to the target as it's possible
    let reward = -childToTargetDistance;

    // but if we're too close to parent - that's bad
    const affectRadius = parent.getAffectRadius() * worldSizeInv;
    if (childToParentDistance < affectRadius) {
      const childToParentDistanceMultiplier = 2;
      const childToParentDistanceCoefficient =
        (childToParentDistance - affectRadius) / affectRadius;

      reward +=
        childToParentDistanceCoefficient * childToParentDistanceMultiplier;
    }

    Vector2Pool.release(childToTarget);
    Vector2Pool.release(childToParent);

    return reward;
  }

  public getNumStates(): number {
    return World.statesCount;
  }

  public getMaxNumActions(): number {
    return World.actionsCount;
  }

  public fixedUpdate() {
    this.child.update();
    this.parent.update();
    this.target.update();
    Matter.Engine.update(this.physicsEngine, World.physicsTimeStep);
  }

  public init(): void {
    this.initPhysics();
    this.initMap();
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

  protected initMap(): void {
    const map = new Map(this, this.physicsWorld);
    this.map = map;
    map.init();
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
