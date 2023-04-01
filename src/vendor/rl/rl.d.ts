declare namespace RL {
  interface IEnvironment {
    getNumStates(): number;
    getMaxNumActions(): number;
  }

  interface IOptions {
    gamma?: number;
    epsilon?: number;
    alpha?: number;
    experience_add_every?: number;
    experience_size?: number;
    learning_steps_per_iteration?: number;
    tderror_clamp?: number;
    num_hidden_units?: number;
  }

  type EnvironmentState = number[];
  type EnvironmentAction = number;
  type EnvironmentReward = number;

  class DQNAgent {
    constructor(env: IEnvironment, opt: IOptions);

    reset(): void;
    toJSON(): object;
    fromJSON(json: object): void;
    act(state: EnvironmentState): EnvironmentAction;
    learn(reward: EnvironmentReward): void;
  }
}

export default RL;
