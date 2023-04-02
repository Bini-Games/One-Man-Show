import { AbstractService } from "../../../core/services/abstract-service";
import { Game } from "../../../core/facade/game";
import { World } from "../../model/world";
import { GameConfig } from "../../data/game-config";
import { ScoreController } from "./score-controller";

export class GameplayController extends AbstractService {
  public static readonly key: string = "GameplayController";

  protected world: World = null;
  protected scoreController: ScoreController = null;

  constructor() {
    super(GameplayController.key);
  }

  public init(): void {
    this.world = Game.getService<World>(World.key);
    this.scoreController = Game.getService<ScoreController>(ScoreController.key);
    this.listenEvents();
  }

  protected listenEvents(): void {
    Game.events.on("gameplay:target_changed", this.onTargetChanged, this);
  }

  protected onTargetChanged(): void {
    const target = this.world.getCurrentTarget();

    if (target === null) {
      this.handleNoTarget();
    }
  }

  protected handleNoTarget(): void {
    if (GameConfig.IsLearning) {
      const world = this.world;
      const targets = world.getTargets();

      for (const target of targets) {
        target.reset();
      }

      world.pickNextTarget();
      this.scoreController.reset();
    }
  }
}
