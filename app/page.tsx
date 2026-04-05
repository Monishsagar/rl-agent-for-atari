"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GameCard } from "@/components/game-card"
import { PageWrapper } from "@/components/page-wrapper"
import { ArrowRight, Brain, BarChart3, Zap, Cpu } from "lucide-react"
import Link from "next/link"

const games = [
  {
    name: "Breakout",
    description: "Classic brick-breaking game. The agent controls a paddle to bounce a ball and destroy bricks at the top of the screen.",
    difficulty: "Medium",
    actionSpace: ["NOOP", "FIRE", "RIGHT", "LEFT"],
    image: "/images/breakout.jpg",
  },
  {
    name: "Pong",
    description: "Two-player table tennis game. The agent controls the right paddle and must defeat the left AI opponent.",
    difficulty: "Easy",
    actionSpace: ["NOOP", "UP", "DOWN"],
    image: "/images/pong.jpg",
  },
  {
    name: "Space Invaders",
    description: "Alien shooting game. The agent must destroy descending aliens while avoiding their projectiles.",
    difficulty: "Hard",
    actionSpace: ["NOOP", "FIRE", "RIGHT", "LEFT", "RIGHTFIRE", "LEFTFIRE"],
    image: "/images/space-invaders.jpg",
  },
]

const features = [
  {
    icon: Brain,
    title: "Deep Q-Network",
    description: "Implementation of the DQN algorithm with experience replay and target networks",
  },
  {
    icon: BarChart3,
    title: "Real-time Metrics",
    description: "Track episode rewards, loss curves, epsilon decay, and Q-value distributions",
  },
  {
    icon: Zap,
    title: "Configurable Training",
    description: "Customize hyperparameters including learning rate, batch size, and exploration",
  },
  {
    icon: Cpu,
    title: "Episode Replay",
    description: "Watch pre-rendered agent gameplay with action probability visualizations",
  },
]

export default function HomePage() {
  return (
    <PageWrapper>
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-24">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="mx-auto max-w-4xl text-balance text-5xl font-bold tracking-tight md:text-7xl">
                Deep Reinforcement Learning for{" "}
                <span className="text-primary">Atari Games</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
                Train intelligent agents using Deep Q-Networks to master classic Atari games. 
                Monitor training progress, visualize learning metrics, and watch your agents improve in real-time.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    View Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/architecture">
                  <Button size="lg" variant="outline">
                    Learn Architecture
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Games Section */}
        <section className="border-t border-border py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Supported Games</h2>
              <p className="mt-4 text-muted-foreground">
                Train DQN agents on these classic Atari environments
              </p>
            </motion.div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {games.map((game, index) => (
                <GameCard
                  key={game.name}
                  name={game.name}
                  description={game.description}
                  difficulty={game.difficulty}
                  actionSpace={game.actionSpace}
                  image={game.image}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border bg-card/50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Project Features</h2>
              <p className="mt-4 text-muted-foreground">
                Everything you need to understand and experiment with Deep RL
              </p>
            </motion.div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border py-24">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Ready to explore?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Dive into the training metrics, explore the DQN architecture, or start configuring your own training runs.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Link href="/train">
                  <Button size="lg">
                    Start Training
                  </Button>
                </Link>
                <Link href="/sessions">
                  <Button size="lg" variant="outline">
                    View Past Sessions
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageWrapper>
  )
}
