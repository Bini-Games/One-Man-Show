import { Game } from "../../../core/facade/game";
import { AbstractService } from "../../../core/services/abstract-service";
import { Child } from "../../model/entities/child";
import { Parent } from "../../model/entities/parent";
import { World } from "../../model/world";
import { GameplayController } from "../gameplay/gameplay-controller";

export class ParentController extends AbstractService {
  public static readonly key: string = "ParentController";

  protected gameplayController: GameplayController;
  protected parent: Parent = null;
  protected child: Child = null;

  constructor() {
    super(ParentController.key);
  }

  public init(): void {
    this.gameplayController = Game.getService(GameplayController.key);

    const world = Game.getService<World>(World.key);
    this.parent = world.getParent();
    this.child = world.getChild();
  }

  protected cantAct(): boolean {
    return this.gameplayController.canAct();
  }
}
