import { AbstractService } from "../../../core/services/abstract-service";
import { Game } from "../../../core/facade/game";
import { World } from "../../model/world";

export class ScoreController extends AbstractService {
  public static readonly key: string = "ScoreController";

  protected score: number = 0;
  protected scoreDelta: number = 0;
  protected world: World;

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
    this.world = Game.getService<World>(World.key);
    this.listenEvents();
    this.reset();
  }

  protected listenEvents(): void {
    Game.events.on("gameplay:target_broken_changed", this.onTargetBrokenStateChanged, this);
    Game.events.on("fixedUpdate", this.fixedUpdate, this);
  }

  protected onTargetBrokenStateChanged(): void {
    this.updateScoreDelta();
  }

  protected updateScoreDelta(): void {
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
