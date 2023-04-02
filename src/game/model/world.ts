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
import { Game } from "../../core/facade/game";
import { ArrayUtils } from "../../core/utils/array-utils";

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
  protected targets: Target[] = [];
  protected currentTarget: Target = null;
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

  public getCurrentTarget(): Target {
    return this.currentTarget;
  }

  public getTargets(): Target[] {
    return this.targets;
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

    const targets = this.targets;

    for (const target of targets) {
      target.reset();
    }
  }

  public getState(): number[] {
    const child = this.child;
    const target = this.currentTarget;
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
    const target = this.currentTarget;
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
    const dangerRadius = parent.getDangerRadius() * worldSizeInv;
    if (childToParentDistance < dangerRadius) {
      const childToParentDistanceMultiplier = 2;
      const childToParentDistanceCoefficient =
        (childToParentDistance - dangerRadius) / dangerRadius;

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

  public init(): void {
    this.initPhysics();
    this.initMap();
    this.initChild();
    this.initParent();
    this.initTargets();
    this.pickRandomTarget();
    this.listenEvents();
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
    const map = new Map(this.physicsWorld);
    this.map = map;
    map.init();
  }

  protected initChild(): void {
    this.child = this.setupGameEntity(new Child());
  }

  protected initParent(): void {
    this.parent = this.setupGameEntity(new Parent());
  }

  protected initTargets(): void {
    const targets = this.map.getTargets();
    this.targets = targets;
    targets.forEach(this.setupGameEntity, this);
  }

  protected pickRandomTarget(): void {
    const prevTarget = this.currentTarget;
    const targets = this.targets;
    const candidates = targets.filter((target) => target !== prevTarget);
    const newTarget = ArrayUtils.random(candidates);
    this.currentTarget = newTarget;
  }

  protected setupGameEntity<EntityType extends GameEntity>(gameEntity: EntityType): EntityType {
    gameEntity.init();
    gameEntity.addToPhysicsWorld(this.physicsWorld);
    return gameEntity;
  }

  protected listenEvents(): void {
    Game.events.addListener("fixedUpdate", this.fixedUpdate, this);
  }

  protected fixedUpdate() {
    const child = this.child;
    const parent = this.parent;
    const targets = this.targets;

    child.update();
    parent.update();

    for (const target of targets) {
      target.update();
    }

    Matter.Engine.update(this.physicsEngine, World.physicsTimeStep);

    child.affectTargets(targets);
    parent.affectTargets(targets);
  }
}
