"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DqnDiagram } from "@/components/dqn-diagram"
import { Network, Database, Code, Cpu } from "lucide-react"

const techStack = [
  { category: "Frontend", tech: "Next.js 14", description: "React framework with App Router" },
  { category: "Frontend", tech: "TypeScript", description: "Type-safe JavaScript" },
  { category: "Frontend", tech: "Tailwind CSS", description: "Utility-first CSS framework" },
  { category: "Frontend", tech: "ShadCN UI", description: "Accessible component library" },
  { category: "Frontend", tech: "Recharts", description: "React charting library" },
  { category: "Frontend", tech: "Framer Motion", description: "Animation library" },
  { category: "Backend", tech: "API Routes", description: "Serverless API endpoints" },
  { category: "Backend", tech: "Zod", description: "Schema validation" },
  { category: "RL Framework", tech: "PyTorch", description: "Deep learning framework" },
  { category: "RL Framework", tech: "Gymnasium", description: "RL environment toolkit" },
  { category: "RL Framework", tech: "Stable-Baselines3", description: "RL algorithm implementations" },
]

const pseudocode = `// Deep Q-Network (DQN) Algorithm

Initialize replay memory D with capacity N
Initialize action-value function Q with random weights θ
Initialize target network Q̂ with weights θ⁻ = θ

for episode = 1 to M do:
    Initialize state s₁
    
    for t = 1 to T do:
        // Epsilon-greedy action selection
        With probability ε select random action aₜ
        Otherwise select aₜ = argmax_a Q(sₜ, a; θ)
        
        // Execute action and observe reward and next state
        Execute action aₜ, observe reward rₜ and state sₜ₊₁
        
        // Store transition in replay memory
        Store transition (sₜ, aₜ, rₜ, sₜ₊₁) in D
        
        // Sample minibatch from replay memory
        Sample random minibatch of transitions from D
        
        // Compute target Q-values
        Set yⱼ = rⱼ + γ max_a' Q̂(sⱼ₊₁, a'; θ⁻)
        
        // Perform gradient descent step
        Perform gradient descent on (yⱼ - Q(sⱼ, aⱼ; θ))²
        
        // Update target network periodically
        Every C steps: θ⁻ ← θ
        
        // Decay exploration rate
        ε ← max(ε_end, ε × ε_decay)
    end for
end for`

export default function ArchitecturePage() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">DQN Architecture</h1>
          <p className="mt-1 text-muted-foreground">
            Understanding Deep Q-Network implementation details
          </p>
        </div>

        <Tabs defaultValue="diagram" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="diagram" className="gap-2">
              <Network className="h-4 w-4" />
              Network Diagram
            </TabsTrigger>
            <TabsTrigger value="replay" className="gap-2">
              <Database className="h-4 w-4" />
              Experience Replay
            </TabsTrigger>
            <TabsTrigger value="pseudocode" className="gap-2">
              <Code className="h-4 w-4" />
              Pseudocode
            </TabsTrigger>
            <TabsTrigger value="stack" className="gap-2">
              <Cpu className="h-4 w-4" />
              Tech Stack
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagram" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Deep Q-Network Architecture</CardTitle>
                <CardDescription>
                  Neural network architecture for learning Q-values from visual input
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DqnDiagram />
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Convolutional Layers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>3 convolutional layers extract visual features from the game screen:</p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Conv1: 32 filters, 8x8 kernel, stride 4</li>
                    <li>Conv2: 64 filters, 4x4 kernel, stride 2</li>
                    <li>Conv3: 64 filters, 3x3 kernel, stride 1</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Fully Connected Layers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Dense layers process extracted features:</p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>FC1: 512 units with ReLU activation</li>
                    <li>Output: n units (one per action)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Key Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <ul className="list-inside list-disc space-y-1">
                    <li>Input: 4 stacked grayscale frames (84x84)</li>
                    <li>ReLU activation throughout</li>
                    <li>Target network for stable training</li>
                    <li>Huber loss for gradient clipping</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="replay" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Experience Replay</CardTitle>
                <CardDescription>
                  Breaking temporal correlations for stable learning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-4 font-semibold">How It Works</h3>
                    <div className="space-y-4 text-sm text-muted-foreground">
                      <p>
                        Experience replay stores agent transitions (state, action, reward, next state) 
                        in a fixed-size memory buffer. During training, random minibatches are sampled 
                        from this buffer instead of using consecutive experiences.
                      </p>
                      <p>
                        This technique addresses two key challenges in reinforcement learning:
                      </p>
                      <ol className="list-inside list-decimal space-y-2 pl-4">
                        <li>
                          <strong className="text-foreground">Temporal correlation:</strong> Consecutive 
                          experiences are highly correlated, which can destabilize neural network training.
                        </li>
                        <li>
                          <strong className="text-foreground">Data efficiency:</strong> Each experience 
                          can be used multiple times for learning, improving sample efficiency.
                        </li>
                      </ol>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-border bg-secondary/50 p-6">
                    <h3 className="mb-4 font-semibold">Replay Buffer Structure</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
                        <span className="text-sm font-medium">Buffer Size</span>
                        <Badge variant="outline">1,000,000 transitions</Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
                        <span className="text-sm font-medium">Batch Size</span>
                        <Badge variant="outline">32 samples</Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
                        <span className="text-sm font-medium">Min Replay Size</span>
                        <Badge variant="outline">50,000 transitions</Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
                        <span className="text-sm font-medium">Sampling</span>
                        <Badge variant="outline">Uniform random</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-2 font-medium">Transition Tuple</h4>
                  <code className="block rounded bg-secondary p-3 font-mono text-sm">
                    {"(sₜ, aₜ, rₜ, sₜ₊₁, done)"}
                  </code>
                  <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-5">
                    <div><strong className="text-foreground">sₜ:</strong> Current state</div>
                    <div><strong className="text-foreground">aₜ:</strong> Action taken</div>
                    <div><strong className="text-foreground">rₜ:</strong> Reward received</div>
                    <div><strong className="text-foreground">sₜ₊₁:</strong> Next state</div>
                    <div><strong className="text-foreground">done:</strong> Terminal flag</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pseudocode">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>DQN Algorithm Pseudocode</CardTitle>
                <CardDescription>
                  Step-by-step implementation of the Deep Q-Network algorithm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg bg-secondary p-6 font-mono text-sm leading-relaxed">
                  {pseudocode}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stack">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
                <CardDescription>
                  Tools and frameworks used in this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Technology</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {techStack.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{item.tech}</TableCell>
                        <TableCell className="text-muted-foreground">{item.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  )
}
