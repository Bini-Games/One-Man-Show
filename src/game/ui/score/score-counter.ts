import { Container, Text } from "pixi.js";
import { ScoreController } from "../../controller/gameplay/score-controller";
import { Game } from "../../../core/facade/game";

export class ScoreCounter extends Container {
  protected text: Text = null;
  protected scoreController: ScoreController = null;

  public init(): void {
    this.scoreController = Game.getService<ScoreController>(ScoreController.key);
    this.initText();
    this.listenEvents();
    this.updateScore();
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
  }

  protected listenEvents(): void {
    Game.events.on("gameplay:score_changed", this.updateScore, this);
  }

  protected updateScore(): void {
    const score = this.scoreController.getScore();
    this.text.text = `SCORE: ${~~score}`;
  }
}
