import { Game } from "../../../core/facade/game";
import { AbstractService } from "../../../core/services/abstract-service";
import { Child } from "../../model/entities/child";
import { Parent } from "../../model/entities/parent";
import { World } from "../../model/world";

export class ParentController extends AbstractService {
  public static readonly key: string = "ParentController";

  protected parent: Parent = null;
  protected child: Child = null;

  constructor() {
    super(ParentController.key);
  }

  public init(): void {
    const world = Game.getService<World>(World.key);
    this.parent = world.getParent();
    this.child = world.getChild();
  }
}
