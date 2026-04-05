import { NextResponse } from "next/server"

const games = [
  {
    id: "breakout",
    name: "Breakout",
    env_id: "BreakoutNoFrameskip-v4",
    description: "Classic brick-breaking game. The agent controls a paddle to bounce a ball and destroy bricks at the top of the screen.",
    action_space: ["NOOP", "FIRE", "RIGHT", "LEFT"],
    difficulty: "Medium",
    max_score: 864,
    image: "/images/breakout.jpg"
  },
  {
    id: "pong",
    name: "Pong",
    env_id: "PongNoFrameskip-v4",
    description: "Two-player table tennis game. The agent controls the right paddle and must defeat the left AI opponent.",
    action_space: ["NOOP", "UP", "DOWN"],
    difficulty: "Easy",
    max_score: 21,
    image: "/images/pong.jpg"
  },
  {
    id: "space-invaders",
    name: "Space Invaders",
    env_id: "SpaceInvadersNoFrameskip-v4",
    description: "Alien shooting game. The agent must destroy descending aliens while avoiding their projectiles.",
    action_space: ["NOOP", "FIRE", "RIGHT", "LEFT", "RIGHTFIRE", "LEFTFIRE"],
    difficulty: "Hard",
    max_score: 10000,
    image: "/images/space-invaders.jpg"
  }
]

export async function GET() {
  return NextResponse.json({ games })
}
