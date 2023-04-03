import { AbstractService } from "../../../core/services/abstract-service";
import { Game } from "../../../core/facade/game";
import { World } from "../../model/world";
import { GameConfig } from "../../data/game-config";
import { ScoreController } from "./score-controller";
import { LearningController } from "../ml/learning-controller";
import { TimerController } from "./timer-controller";
import { Timer } from "eventemitter3-timer";
import { Math2 } from "../../../core/math/math2";

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
  protected catchActive: boolean = false;
  protected moveAwaySpeed: number = GameConfig.MoveAwaySpeedMax;

  constructor() {
    super(GameplayController.key);
  }

  public canAct(): boolean {
    return !this.catchActive && !this.ended;
  }

  public isCatchActive(): boolean {
    return this.catchActive;
  }

  public hasEnded(): boolean {
    return this.ended;
  }

  public getEndReason(): EndReason {
    return this.endReason;
  }

  public init(): void {
    this.world = Game.getService(World.key);
    this.scoreController = Game.getService(ScoreController.key);
    this.timerController = Game.getService(TimerController.key);
    this.learningController = Game.getService(LearningController.key);

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
    Game.events.on("gameplay:catch_available", this.onCatchAvailable, this);
  }

  protected onTargetChanged(): void {
    const target = this.world.getCurrentTarget();

    if (target === null) {
      this.handleNoTarget();
    }
  }

  protected onTimerEnded(): void {
    if (GameConfig.IsLearning) {
      this.setupForNewLearningPhase();
    } else {
      this.endGameplay(EndReason.TimedOut);
    }
  }

  protected onCatchAvailable(): void {
    if (this.catchActive) {
      return;
    }

    this.catchActive = true;
    Game.events.emit('gameplay:catch');

    new Timer(250)
      .start()
      .on("end", this.moveCatcherAway, this);

    new Timer(500)
      .start()
      .on("end", this.stopCatch, this);
  }

  protected moveCatcherAway(): void {
    const world = this.world;
    const parent = world.getParent();
    const velocityAway = parent
      .getPosition()
      .clone()
      .sub(
        world
          .getChild()
          .getPosition()
      )
      .setLength(this.moveAwaySpeed);
      console.log(this.moveAwaySpeed);
      
    parent.setVelocity(velocityAway.x, velocityAway.y);
    this.moveAwaySpeed = Math2.lerp(GameConfig.MoveAwaySpeedMin, this.moveAwaySpeed, 0.9);
  }

  protected stopCatch(): void {
    if (!this.catchActive) {
      return;
    }

    const world = this.world;
    const parent = world.getParent();
    parent.resetVelocity();
    this.catchActive = false;
  }

  protected handleNoTarget(): void {
    if (GameConfig.IsLearning) {
      this.setupForNewLearningPhase();
    } else {
      this.endGameplay(EndReason.AllTargetsBroken);
    }
  }

  protected setupForNewLearningPhase(): void {
    const world = this.world;
    world.resetTargets();
    world.pickNextTarget();
    this.scoreController.reset();
    this.timerController.reset();
    this.moveAwaySpeed = GameConfig.MoveAwaySpeedMax;
  }

  protected endGameplay(reason: EndReason): void {
    this.ended = true;
    this.endReason = reason;
    this.learningController.stop();
    Game.events.emit("gameplay:end", reason);
  }
}
