import * as Matter from "matter-js";
import { World } from "./world";

export class Map {
  protected world: World = null;
  protected physicsWorld: Matter.World = null;

  constructor(world: World, physicsWorld: Matter.World) {
    this.world = world;
    this.physicsWorld = physicsWorld;
  }
}
