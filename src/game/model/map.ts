import * as Matter from "matter-js";
import { World } from "./world";
import { Obstacle } from "./entities/obstacles/obstacle";
import { GameConfig } from "../data/game-config";
import { BodyFactories } from "./entities/obstacles/body-factory";
import { ObstacleType } from "./entities/obstacles/obstacle-type.enum";

export class Map {
  protected obstacles: Obstacle[] = [];
  protected world: World = null;
  protected physicsWorld: Matter.World = null;

  constructor(world: World, physicsWorld: Matter.World) {
    this.world = world;
    this.physicsWorld = physicsWorld;
  }

  public init(): void {
    this.initWalls();
  }

  protected initWalls(): void {
    const worldSize = GameConfig.WorldSize;
    const wallThickness = worldSize * 0.01;
    this.createWall(0, 0, worldSize, wallThickness, 0); // top
    this.createWall(0, 0, wallThickness, worldSize, 0); // left
    this.createWall(worldSize - wallThickness, 0, wallThickness, worldSize, 0); // right
    this.createWall(0, worldSize - wallThickness, worldSize, wallThickness, 0); // bottom
  }

  protected createWall(x: number, y: number, width: number, height: number, angle: number): Obstacle {
    const obstacle = new Obstacle(ObstacleType.Wall, BodyFactories.Rectangle(width, height, {
      position: Matter.Vector.create(x, y),
      angle,
      isStatic: true,
    }));
    return this.setupObstacle(obstacle);
  }

  protected setupObstacle(obstacle: Obstacle): Obstacle {
    this.obstacles.push(obstacle);
    obstacle.init();
    obstacle.addToPhysicsWorld(this.physicsWorld);
    return obstacle;
  }
}
