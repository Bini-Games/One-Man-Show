import { Container, Sprite, Texture } from "pixi.js";

export class ProgressBar extends Container {
  public bgColor: string = "red";
  public fillColor: string = "green";
  public baseWidth: number = 100;
  public baseHeight: number = 20;

  protected bg: Sprite = null;
  protected fill: Sprite = null;
  protected progress: number = 1;

  public init(): void {
    this.initBg();
    this.initFill();
    this.updateStyle();
  }

  public setProgress(value: number): void {
    this.progress = value;
    this.fill.width = value * this.baseWidth;
  }

  public updateStyle(): void {
    const baseHeight = this.baseHeight;

    const bg = this.bg;
    bg.tint = this.bgColor;
    bg.height = baseHeight;
    bg.width = this.baseWidth;

    const fill = this.fill;
    fill.tint = this.fillColor;
    fill.height = baseHeight;

    this.setProgress(this.progress);
  }

  public align(anchorX: number, anchorY: number = anchorX): void {
    this.bg.position.set(-anchorX * this.baseWidth, -anchorY * this.baseHeight);
    this.fill.position.copyFrom(this.bg.position);
  }

  protected initBg(): void {
    const bg = new Sprite(Texture.WHITE);
    this.bg = bg;
    this.addChild(bg);
  }

  protected initFill(): void {
    const fill = new Sprite(Texture.WHITE);
    this.fill = fill;
    this.addChild(fill);
  }
}
