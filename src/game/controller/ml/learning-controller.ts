import { Game } from "../../../core/facade/game";
import { AbstractService } from "../../../core/services/abstract-service";
import { GameConfig } from "../../data/game-config";
import { AgentController } from "./agent-controller";

export class LearningController extends AbstractService {
  public static readonly key: string = "LearningController";

  protected agentController: AgentController = null;
  protected ticksTillAction: number = GameConfig.TicksPerAction;

  constructor() {
    super(LearningController.key);
  }

  public start(): void {
    this.act();
  }

  public init(): void {
    this.initAgentController();
    this.listenEvents();
  }

  protected initAgentController(): void {
    const agentController = new AgentController();
    this.agentController = agentController;
    agentController.init();
  }

  protected listenEvents(): void {
    Game.events.addListener('fixedUpdate', this.fixedUpdate, this);
  }

  protected fixedUpdate(): void {
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
