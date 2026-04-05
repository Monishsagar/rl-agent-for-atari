export interface Game {
  id: string
  name: string
  env_id: string
  description: string
  action_space: string[]
  difficulty: string
  max_score: number
  image: string
}

export interface Session {
  session_id: string
  game: string
  created_at: string
  total_episodes: number
  best_reward: number
  final_epsilon: number
  status: "completed" | "running" | "stopped"
}

export interface EpisodeReward {
  episode: number
  reward: number
  timestamp: string
}

export interface EpsilonValue {
  episode: number
  epsilon: number
}

export interface LossValue {
  step: number
  loss: number
}

export interface QValueBin {
  bin: string
  count: number
}

export interface ActionDistribution {
  action: string
  probability: number
}

export interface Hyperparameters {
  total_timesteps: number
  learning_rate: number
  epsilon_start: number
  epsilon_end: number
  epsilon_decay: number
  batch_size: number
  gamma: number
}

export interface Metrics {
  session_id: string
  game: string
  env_id: string
  hyperparameters: Hyperparameters
  episode_rewards: EpisodeReward[]
  epsilon_values: EpsilonValue[]
  loss_values: LossValue[]
  q_values: QValueBin[]
  action_distribution: ActionDistribution[]
}

export interface ConfigPayload extends Hyperparameters {
  game: "breakout" | "pong" | "space-invaders"
}
