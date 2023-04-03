import { Assets, Container, DisplayObject, ObservablePoint, Sprite, Text, Texture } from "pixi.js";
import { Game } from "../../../core/facade/game";
import { Math2 } from "../../../core/math/math2";
import { ScoreController } from "../../controller/gameplay/score-controller";
import { Easing, Tween } from "@tweenjs/tween.js";
import { Timer } from "eventemitter3-timer";

export enum ResultScreenType {
  Happy = "Happy",
  Sad = "Sad",
}

export class ResultScreen extends Container {
  protected bg: Sprite = null;
  protected character: Sprite = null;
  protected scoreText: Text = null;
  protected resultText: Text = null;
  protected restartButton: Sprite = null;

  public show(type: ResultScreenType): void {
    const score = Game.getService<ScoreController>(ScoreController.key).getScore();
    this.scoreText.text = `SCORE: ${~~score}`;

    switch (type) {
      case ResultScreenType.Happy:
        this.character.texture = Assets.cache.get("result_screen:child_happy");
        this.resultText.text = "YOUR CHILD\nIS HAPPY!";
        break;
      case ResultScreenType.Sad:
        this.character.texture = Assets.cache.get("result_screen:child_sad");
        this.resultText.text = "YOUR CHILD\nIS SAD...";
        break;
    }

    this.showFade(this).onComplete(() => {
      this.showScale(this.character).onComplete(() => {
        this.showScale(this.restartButton);
      });
    });
  }

  public init(): void {
    this.visible = false;
    this.initBg();
    this.initCharacter();
    this.initScoreText();
    this.initResultText();
    this.initRestartButton();
    this.listenEvents();
  }

  protected initBg(): void {
    const bg = new Sprite(Texture.WHITE);
    this.bg = bg;
    this.addChild(bg);
    bg.tint = "#8f6fd8";
    bg.eventMode = "static";
  }

  protected initCharacter(): void {
    const character = new Sprite(Assets.cache.get("result_screen:child_sad"));
    this.character = character;
    this.addChild(character);
    character.visible = false;
    character.anchor.set(0.5);
  }

  protected initScoreText(): void {
    const scoreText = new Text("", {
      align: "center",
      fontFamily: "Arial",
      fontWeight: "bold",
      fontSize: 40,
      fill: "white",
      stroke: "black",
      strokeThickness: 5,
    });
    this.scoreText = scoreText;
    this.addChild(scoreText);
    scoreText.anchor.set(0.5);
  }

  protected initResultText(): void {
    const resultText = new Text("", {
      align: "center",
      fontFamily: "Arial",
      fontWeight: "bold",
      fontSize: 40,
      fill: "white",
      stroke: "black",
      strokeThickness: 5,
    });
    this.resultText = resultText;
    this.addChild(resultText);
    resultText.anchor.set(0.5);
  }

  protected initRestartButton(): void {
    const restartButton = new Sprite(Assets.cache.get("result_screen:button_restart"));
    this.restartButton = restartButton;
    this.addChild(restartButton);
    restartButton.visible = false;
    restartButton.anchor.set(0.5);
    restartButton.eventMode = "static";
  }

  protected listenEvents(): void {
    Game.events.on("resize", this.onResize, this);
    this.restartButton.on('pointerdown', this.onRestartButtonDown, this);
    this.restartButton.on('pointerup', this.onRestartButtonUp, this);
    this.restartButton.on('pointerupoutside', this.onRestartButtonUp, this);
  }

  protected onResize(): void {
    const layout = Game.layout;

    const bg = this.bg;
    bg.width = layout.width;
    bg.height = layout.height;

    const character = this.character;
    const scoreText = this.scoreText;
    const resultText = this.resultText;
    const restartButton = this.restartButton;

    [
      character,
      scoreText,
      resultText,
      restartButton,
    ].forEach((element) => element.scale.set(1));

    if (layout.isPortrait) {
      character.scale.set(Math.min(layout.width / character.width, layout.height / 2500));
      character.position.set(layout.width * 0.5, layout.height * 0.4);

      restartButton.scale.set(Math.min(layout.width / 500, layout.height / 2000));
      restartButton.position.set(character.x, layout.height * 0.8);

      const characterBottom = character.y + character.height * 0.5;
      const buttonTop = restartButton.y - restartButton.height * 0.5;
      resultText.scale.set(Math.min(layout.width / resultText.width * 0.85, layout.height / 1000));
      resultText.position.set(character.x, Math2.lerp(characterBottom, buttonTop, 0.5));

      const characterToTextDistance = resultText.y - characterBottom;
      const characterTop = character.y - character.height * 0.5;
      scoreText.scale.set(resultText.scale.x);
      scoreText.position.set(character.x, characterTop - characterToTextDistance);
    } else {
      character.scale.set(layout.height / character.height * 0.8);
      character.position.set(layout.width * 0.3, layout.height * 0.5);

      restartButton.position.set(layout.width * 0.7, layout.height * 0.7);
      restartButton.scale.set(Math.min(layout.height / 800, layout.width / 1500));

      scoreText.position.set(restartButton.x, layout.height * 0.20);

      const buttonTop = restartButton.y - restartButton.height * 0.5;
      resultText.position.set(restartButton.x, Math2.lerp(scoreText.y, buttonTop, 0.6));
    }
  }

  protected showFade(object: DisplayObject): Tween<DisplayObject> {
    object.visible = true;

    object.alpha = 0;

    const tween = new Tween(object);
    tween
      .to({
        alpha: 1,
      }, 500)
      .easing(Easing.Sinusoidal.Out)
      .start();
    return tween;
  }

  protected showScale(object: DisplayObject): Tween<ObservablePoint> {
    object.visible = true;

    const targetScaleX = object.scale.x;
    const targetScaleY = object.scale.y;

    object.scale.set(0);

    const tween = new Tween(object.scale);
    tween
      .to({
        x: targetScaleX,
        y: targetScaleY,
      }, 500)
      .easing(Easing.Back.Out)
      .start();
    return tween;
  }

  protected onRestartButtonDown(): void {
    const button = this.restartButton;
    button.scale.set(button.scale.x * 0.9);
  }

  protected onRestartButtonUp(): void {
    this.onResize(); // reset scales

    new Timer(200)
      .start()
      .on('end', () => {
        window.location.reload(); // restart game by reloading window - bad idea, but it's fast :)
      });
  }
}
