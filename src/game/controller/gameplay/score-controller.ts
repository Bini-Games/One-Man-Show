import { AbstractService } from "../../../core/services/abstract-service";
import { Game } from "../../../core/facade/game";
import { World } from "../../model/world";
import { GameplayController } from "./gameplay-controller";

export class ScoreController extends AbstractService {
  public static readonly key: string = "ScoreController";

  protected score: number = 0;
  protected scoreDelta: number = 0;
  protected world: World;
  protected gameplayController: GameplayController;

  constructor() {
    super(ScoreController.key);
  }

  public getScore(): number {
    return this.score;
  }

  public reset(): void {
    this.score = 0;
    this.scoreDelta = 0;
    this.updateScoreDelta();
    this.onScoreChanged();
  }

  public init(): void {
    this.world = Game.getService(World.key);
    this.gameplayController = Game.getService(GameplayController.key);
    this.listenEvents();
    this.reset();
  }

  protected listenEvents(): void {
    Game.events.on("gameplay:target_broken_changed", this.onTargetBrokenStateChanged, this);
    Game.events.on("gameplay:catch", this.onCatch, this);
    Game.events.on("gameplay:end", this.onGameplayEnded, this);
    Game.events.on("fixedUpdate", this.fixedUpdate, this);
  }

  protected onTargetBrokenStateChanged(): void {
    this.updateScoreDelta();
  }

  protected onCatch(): void {
    this.score += 100;
  }

  protected onGameplayEnded(): void {
    this.scoreDelta = 0;
  }

  protected updateScoreDelta(): void {
    if (this.gameplayController.hasEnded()) {
      return;
    }

    let scoreDelta = 0;
    const targets = this.world.getTargets();

    for (const target of targets) {
      if (target.isBroken()) {
        scoreDelta -= 0.2;
      } else if (target.isFull()) {
        scoreDelta += 0.1;
      }
    }

    this.scoreDelta = scoreDelta;
  }

  protected fixedUpdate(): void {
    this.score += this.scoreDelta;
    this.onScoreChanged();
  }

  protected onScoreChanged(): void {
    Game.events.emit("gameplay:score_changed", this.score);
  }
}
