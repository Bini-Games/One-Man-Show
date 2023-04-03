import { AbstractService } from "../../../core/services/abstract-service";
import { Game } from "../../../core/facade/game";
import { World } from "../../model/world";
import { GameConfig } from "../../data/game-config";
import { ScoreController } from "./score-controller";
import { LearningController } from "../ml/learning-controller";
import { TimerController } from "./timer-controller";

export enum EndReason {
  AllTargetsBroken = "AllTargetsBroken",
  TimedOut = "TimedOut",
}

export class GameplayController extends AbstractService {
  public static readonly key: string = "GameplayController";

  protected world: World = null;
  protected scoreController: ScoreController = null;
  protected timerController: TimerController = null;
  protected learningController: LearningController = null;
  protected ended: boolean = false;
  protected endReason: EndReason = null;

  constructor() {
    super(GameplayController.key);
  }

  public hasEnded(): boolean {
    return this.ended;
  }

  public getEndReason(): EndReason {
    return this.endReason;
  }

  public init(): void {
    this.world = Game.getService<World>(World.key);
    this.scoreController = Game.getService<ScoreController>(ScoreController.key);
    this.timerController = Game.getService<TimerController>(TimerController.key);
    this.learningController = Game.getService<LearningController>(LearningController.key);

    this.listenEvents();

    this.scoreController.init();
    this.timerController.init();
    this.learningController.init();
  }

  public start(): void {
    this.learningController.start();
  }

  protected listenEvents(): void {
    Game.events.on("gameplay:target_changed", this.onTargetChanged, this);
    Game.events.on("gameplay:timer_ended", this.onTimerEnded, this);
  }

  protected onTargetChanged(): void {
    const target = this.world.getCurrentTarget();

    if (target === null) {
      this.handleNoTarget();
    }
  }

  protected onTimerEnded(): void {
    this.endGameplay(EndReason.TimedOut);
  }

  protected handleNoTarget(): void {
    if (GameConfig.IsLearning) {
      const world = this.world;
      world.resetTargets();
      world.pickNextTarget();
      this.scoreController.reset();
      this.timerController.reset();
    } else {
      this.endGameplay(EndReason.AllTargetsBroken);
    }
  }

  protected endGameplay(reason: EndReason): void {
    this.ended = true;
    this.endReason = reason;
    this.learningController.stop();
    Game.events.emit("gameplay:end", reason);
  }
}
