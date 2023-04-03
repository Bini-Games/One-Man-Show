import { AbstractService } from "../../../core/services/abstract-service";
import { Game } from "../../../core/facade/game";
import { World } from "../../model/world";
import { GameplayController } from "./gameplay-controller";
import { GameConfig } from "../../data/game-config";

export class TimerController extends AbstractService {
  public static readonly key: string = "TimerController";

  protected timeLeft: number = 0;
  protected gameplayController: GameplayController;

  constructor() {
    super(TimerController.key);
  }

  public getTimeLeft(): number {
    return this.timeLeft;
  }

  public reset(): void {
    this.timeLeft = GameConfig.RoundTime;
  }

  public init(): void {
    this.gameplayController = Game.getService(GameplayController.key);
    this.listenEvents();
    this.reset();
  }

  protected listenEvents(): void {
    Game.events.on("gameplay:end", this.onGameplayEnded, this);
    Game.events.on("fixedUpdate", this.fixedUpdate, this);
  }

  protected onGameplayEnded(): void {
    Game.events.off("fixedUpdate", this.fixedUpdate, this);
  }

  protected fixedUpdate(): void {
    if (this.gameplayController.hasEnded()) {
      return;
    }

    this.timeLeft -= World.timeStep;

    if (this.timeLeft <= 0) {
      this.handleTimedOut();
    }
  }

  protected handleTimedOut(): void {
    Game.events.emit("gameplay:timer_ended");
  }
}
