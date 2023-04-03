import { Game } from "../../../core/facade/game";
import { AbstractService } from "../../../core/services/abstract-service";
import { GameConfig } from "../../data/game-config";
import { GameplayController } from "../gameplay/gameplay-controller";
import { AgentController } from "./agent-controller";

export class LearningController extends AbstractService {
  public static readonly key: string = "LearningController";

  protected gameplayController: GameplayController = null;
  protected agentController: AgentController = null;
  protected ticksTillAction: number = Infinity;
  protected learning: boolean = false;

  constructor() {
    super(LearningController.key);
  }

  public start(): void {
    this.learning = true;
    this.ticksTillAction = GameConfig.TicksPerAction;
    this.act();
  }

  public stop(): void {
    this.learning = false;
    this.ticksTillAction = Infinity;
  }

  public init(): void {
    this.gameplayController = Game.getService(GameplayController.key);
    this.initAgentController();
    this.listenEvents();
  }

  protected initAgentController(): void {
    const agentController = new AgentController();
    this.agentController = agentController;
    agentController.init();
  }

  protected listenEvents(): void {
    Game.events.on("fixedUpdate", this.fixedUpdate, this);
  }

  protected fixedUpdate(): void {
    if (!this.gameplayController.canAct()) {
      return;
    }

    if (--this.ticksTillAction === 0) {
      this.ticksTillAction = GameConfig.TicksPerAction;
      this.learn();
      this.act();
    }
  }

  protected learn(): void {
    this.agentController.learn();
  }

  protected act(): void {
    this.agentController.act();
  }
}
