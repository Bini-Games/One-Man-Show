import { AbstractService } from "../../../core/services/abstract-service";
import { GameConfig } from "../../data/game-config";
import { World } from "../../model/world";
import { AgentController } from "./agent-controller";

export class LearningController extends AbstractService {
  public static readonly key: string = "LearningController";

  protected world: World = null;
  protected agentController: AgentController = null;
  protected ticksTillAction: number = GameConfig.TicksPerAction;

  constructor() {
    super(LearningController.key);
  }

  public start(): void {
    this.act();
  }

  public update(): void {
    if (--this.ticksTillAction === 0) {
      this.ticksTillAction = GameConfig.TicksPerAction;
      this.learn();
      this.act();
    }
  }

  public init(world: World): void {
    this.world = world;
    this.initAgentController();
  }

  protected initAgentController(): void {
    const agentController = new AgentController();
    this.agentController = agentController;
    agentController.init(this.world);
  }

  protected learn(): void {
    this.agentController.learn();
  }

  protected act(): void {
    this.agentController.act();
  }
}
