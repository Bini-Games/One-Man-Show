import * as TWEEN from "@tweenjs/tween.js";
import { Application } from "pixi.js";
import { Game } from "./core/facade/game";
import { Logger } from "./core/facade/logger";
import { World } from "./game/model/world";
import { Timer } from "eventemitter3-timer";
import { WorldView } from "./game/view/world-view";

const canvas = document.createElement("canvas");
canvas.id = "game";
document.body.appendChild(canvas);

const app = new Application({
  width: 700,
  height: 700,
  antialias: true,
  backgroundColor: 0x353540,
  view: canvas,
});

Game.registerService(Logger.key, new Logger());

const world = new World();
Game.registerService(World.key, world);

const worldView = new WorldView(world);
Game.registerService(WorldView.key, worldView);

window.onload = load;

function load() {
  app.ticker.add(tick);

  world.init();
  world.reset();

  worldView.init();
  app.stage.addChild(worldView.getContainer());

  tick();
}

let accumulated = 0;

function tick() {
  Timer.timerManager.update(app.ticker.elapsedMS);
  TWEEN.update();

  const sec = app.ticker.deltaMS * 0.001;
  const frameTime = sec > 0.25 ? 0.25 : sec;
  accumulated += frameTime;

  const dt = World.timeStep;

  while (accumulated >= dt) {
    world.fixedUpdate();
    accumulated -= dt;
  }

  worldView.update();

  app.renderer.render(app.stage);
}
