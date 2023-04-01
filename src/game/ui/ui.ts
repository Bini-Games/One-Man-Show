import { Container } from "pixi.js";
import { Joystick } from "./joystick/joystick";

export class UI extends Container {
  protected joystick: any = null;

  public init(): void {
    this.initJoystick();
  }

  protected initJoystick(): void {
    const joystick = new Joystick();
    this.joystick = joystick;
    this.addChild(joystick);
  }
}
