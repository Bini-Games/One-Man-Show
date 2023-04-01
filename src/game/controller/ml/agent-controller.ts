import RL from "../../../vendor/rl/rl";
import { Math2 } from "../../../core/math/math2";
import { ActionType } from "../../model/action-type.enum";
import { World } from "../../model/world";

export class AgentController {
  protected agent: RL.DQNAgent = null;
  protected world: World = null;
  protected previousReward: number = null;

  public learn(): void {
    const reward = this.world.getReward();

    if (this.previousReward === null) {
      this.previousReward = reward;
    }

    const smoothReward = Math2.lerp(this.previousReward, reward, 0.999);
    this.agent.learn(smoothReward);
  }

  public act(): void {
    const world = this.world;
    const state = world.getState();
    const action: ActionType = this.agent.act(state);
    world.doAction(action);
  }

  public init(world: World): void {
    this.world = world;
    this.initAgent();
  }

  protected initAgent(): void {
    const options: RL.IOptions = {
      update: 'qlearn', // qlearn | sarsa
      gamma: 0.9, // discount factor, [0, 1)
      epsilon: 0.2, // initial epsilon for epsilon-greedy policy, [0, 1)
      alpha: 0.01, // value function learning rate
      experience_add_every: 10, // number of time steps before we add another experience to replay memory
      experience_size: 5000, // size of experience replay memory
      learning_steps_per_iteration: 20,
      tderror_clamp: 1.0, // for robustness
      num_hidden_units: 100, // number of neurons in hidden layer
    }
    this.agent = new RL.DQNAgent(this.world, options)
  }
}
