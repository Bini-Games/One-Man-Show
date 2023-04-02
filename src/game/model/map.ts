import * as Matter from "matter-js";
import { Obstacle } from "./entities/obstacles/obstacle";
import { GameConfig } from "../data/game-config";
import { BodyFactories } from "./entities/obstacles/body-factory";
import { Target } from "./entities/target";
import { TargetType } from "./entities/target-type.enum";
import { Wall } from "./entities/obstacles/wall";

export class Map {
  protected obstacles: Obstacle[] = [];
  protected targets: Target[] = [];
  protected physicsWorld: Matter.World = null;

  constructor(physicsWorld: Matter.World) {
    this.physicsWorld = physicsWorld;
  }

  public getTargets(): Target[] {
    return this.targets.slice(0);
  }

  public getObstacles(): Obstacle[] {
    return this.obstacles.slice(0);
  }

  public init(): void {
    this.initWalls();
    this.initTargets();
  }

  protected initWalls(): void {
    const worldSize = GameConfig.WorldSize;
    const wallThickness = worldSize * 0.05;
    const halfThickness = wallThickness * 0.5;

    this.createWall(worldSize * 0.5, -halfThickness, worldSize, wallThickness, 0); // top
    this.createWall(worldSize * 0.5, worldSize + halfThickness, worldSize, wallThickness, 0); // bottom
    this.createWall(-halfThickness, worldSize * 0.5, wallThickness, worldSize, 0); // left
    this.createWall(worldSize + halfThickness, worldSize * 0.5, wallThickness, worldSize, 0); // right
  }

  protected initTargets(): void {
    const worldSize = GameConfig.WorldSize;

    this.createSimpleTarget(worldSize * 0.0, worldSize * 0.3, TargetType.TeddyBear);
    this.createSimpleTarget(worldSize * 0.5, worldSize * 0.0, TargetType.Train);
    this.createSimpleTarget(worldSize * 1.0, worldSize * 0.8, TargetType.Doll);
    // this.createSimpleTarget(worldSize * 0.3, worldSize * 1.0, TargetType.Ball);
  }

  protected createWall(x: number, y: number, width: number, height: number, angle: number): Obstacle {
    const obstacle = new Wall(width, height, BodyFactories.Rectangle(width, height, {
      position: Matter.Vector.create(x, y),
      angle,
      isStatic: true,
    }));
    return this.setupObstacle(obstacle);
  }

  protected createSimpleTarget(x: number, y: number, type: TargetType): Target {
    const target = new Target(type);
    this.setupTarget(target);
    target.setDefaultPosition(x, y);
    return target;
  }

  protected setupObstacle(obstacle: Obstacle): Obstacle {
    this.obstacles.push(obstacle);
    obstacle.init();
    obstacle.addToPhysicsWorld(this.physicsWorld);
    return obstacle;
  }

  protected setupTarget(target: Target): Target {
    this.targets.push(target);
    target.init();
    target.addToPhysicsWorld(this.physicsWorld);
    return target;
  }
}
