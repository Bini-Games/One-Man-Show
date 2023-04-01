import * as TWEEN from "@tweenjs/tween.js";
import { Application } from "pixi.js";
import { Game } from "./core/facade/game";
import { Logger } from "./core/facade/logger";
import { World } from "./game/model/world";

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
Game.registerService(World.key, new World());

window.onload = load;

function load() {
  app.ticker.add(tick);
  tick();
}

function tick() {
  TWEEN.update();
  app.renderer.render(app.stage);
}
