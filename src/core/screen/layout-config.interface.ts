import { IRenderer, Container } from "pixi.js";

export interface ILayoutConfig {
  container: Container;
  renderer: IRenderer;
  longSide: number;
  shortSide: number;
}
