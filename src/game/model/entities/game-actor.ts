import { GameConfig } from "../../data/game-config";
import { MoveableEntity } from "./moveable-entity";
import { Target } from "./target";

export class GameActor extends MoveableEntity {
  public getConditionChange(): number {
    return 0;
  }

  public getTargetAffectionRadius(): number {
    return 75 * GameConfig.UnitSize;
  }

  public affectTargets(targets: Target[]): void {
    const position = this.getPosition();
    const change = this.getConditionChange();
    const affectRadius = this.getTargetAffectionRadius();

    for (const target of targets) {
      const distance = target
        .getPosition()
        .distanceTo(position);

      if (distance < affectRadius) {
        target.affectCondition(change);
      }
    }
  }
}
