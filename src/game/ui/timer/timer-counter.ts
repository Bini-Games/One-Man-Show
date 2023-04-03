import { Container, Text } from "pixi.js";
import { TimerController } from "../../controller/gameplay/timer-controller";
import { Game } from "../../../core/facade/game";

export class TimerCounter extends Container {
  protected text: Text = null;
  protected timerController: TimerController = null;

  public init(): void {
    this.timerController = Game.getService(TimerController.key);
    this.initText();
    this.listenEvents();
    this.updateTime();
  }

  public initText(): void {
    const text = new Text("", {
      align: "center",
      fontFamily: "Arial",
      fontWeight: "bold",
      fontSize: 40,
      fill: "white",
      stroke: "black",
      strokeThickness: 5,
    });
    this.text = text;
    this.addChild(text);
    text.anchor.set(1, 0);
  }

  protected listenEvents(): void {
    Game.events.on("update", this.updateTime, this);
  }

  protected updateTime(): void {
    const time = Math.ceil(this.timerController.getTimeLeft());
    const timeString = time.toString();
    this.text.text = `TIME: ${timeString.length === 1 ? "0" + timeString : timeString}S.`;
  }
}
