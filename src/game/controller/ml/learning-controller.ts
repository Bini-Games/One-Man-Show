import { Assets } from "pixi.js";
import { Game } from "../../../core/facade/game";
import { AbstractService } from "../../../core/services/abstract-service";
import { FileManager } from "../../../core/utils/file-manager";
import { GameConfig } from "../../data/game-config";
import { GameplayController } from "../gameplay/gameplay-controller";
import { AgentController } from "./agent-controller";

export class LearningController extends AbstractService {
  public static readonly key: string = "LearningController";

  protected gameplayController: GameplayController = null;
  protected agentController: AgentController = null;
  protected ticksTillAction: number = Infinity;
  protected learning: boolean = false;
  protected fileManager: FileManager = null;

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
    this.fileManager = Game.getService(FileManager.key);
    this.initAgentController();

    if (GameConfig.UseLoadedBrain) {
      this.agentController.setFromBrainData(Assets.cache.get("ml:brain"));
    }

    this.listenEvents();
  }

  protected initAgentController(): void {
    const agentController = new AgentController();
    this.agentController = agentController;
    agentController.init();
  }

  protected listenEvents(): void {
    Game.events.on("fixedUpdate", this.fixedUpdate, this);
    document.addEventListener("keydown", this.onKeyDown.bind(this));
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

  protected onKeyDown(ev: KeyboardEvent): void {
    const code = ev.code;

    switch (code) {
      case "KeyS":
        this.save();
        break;
      case "KeyO":
        this.open();
        break;
    }
  }

  protected save(): void {
    const data = this.agentController.serializeAgent();
    this.fileManager.export(data, "ec5.brain");
  }

  protected open(): void {
    this.fileManager.import((data: string) => {
      this.agentController.deserializeAgent(data);
    });
  }
}
