"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, CheckCircle, Cpu, Zap, Target } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const configSchema = z.object({
  game: z.enum(["breakout", "pong", "space-invaders"]),
  total_timesteps: z.number().min(1000).max(10000000),
  learning_rate: z.number().min(0.000001).max(1),
  epsilon_start: z.number().min(0).max(1),
  epsilon_end: z.number().min(0).max(1),
  epsilon_decay: z.number().min(0).max(1),
  batch_size: z.number().int().min(1).max(512),
  gamma: z.number().min(0).max(1),
})

type ConfigFormData = z.infer<typeof configSchema>

const defaultValues: ConfigFormData = {
  game: "breakout",
  total_timesteps: 1000000,
  learning_rate: 0.0001,
  epsilon_start: 1.0,
  epsilon_end: 0.01,
  epsilon_decay: 0.995,
  batch_size: 32,
  gamma: 0.99,
}

function TrainForm() {
  const searchParams = useSearchParams()
  const gameParam = searchParams.get("game")
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      ...defaultValues,
      game: (gameParam as ConfigFormData["game"]) || defaultValues.game,
    },
  })

  const watchedValues = watch()

  const onSubmit = async (data: ConfigFormData) => {
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitResult({
          success: true,
          message: result.message || "Configuration validated successfully!",
        })
      } else {
        setSubmitResult({
          success: false,
          message: result.error || "Validation failed",
        })
      }
    } catch {
      setSubmitResult({
        success: false,
        message: "Network error. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const games = [
    { value: "breakout", label: "Breakout", difficulty: "Medium" },
    { value: "pong", label: "Pong", difficulty: "Easy" },
    { value: "space-invaders", label: "Space Invaders", difficulty: "Hard" },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Game Selection */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Environment
          </CardTitle>
          <CardDescription>Select the Atari game environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="game">Game</Label>
            <Select
              value={watchedValues.game}
              onValueChange={(value) => setValue("game", value as ConfigFormData["game"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                {games.map((game) => (
                  <SelectItem key={game.value} value={game.value}>
                    <span className="flex items-center gap-2">
                      {game.label}
                      <Badge variant="outline" className="text-xs">
                        {game.difficulty}
                      </Badge>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Training Parameters */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Training Parameters
          </CardTitle>
          <CardDescription>Configure the training hyperparameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="total_timesteps">Total Timesteps</Label>
              <Input
                id="total_timesteps"
                type="number"
                {...register("total_timesteps", { valueAsNumber: true })}
              />
              {errors.total_timesteps && (
                <p className="text-sm text-destructive">{errors.total_timesteps.message}</p>
              )}
              <p className="text-xs text-muted-foreground">Range: 1,000 - 10,000,000</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="learning_rate">Learning Rate</Label>
              <Input
                id="learning_rate"
                type="number"
                step="0.0001"
                {...register("learning_rate", { valueAsNumber: true })}
              />
              {errors.learning_rate && (
                <p className="text-sm text-destructive">{errors.learning_rate.message}</p>
              )}
              <p className="text-xs text-muted-foreground">Typical: 0.0001 - 0.001</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch_size">Batch Size</Label>
              <Input
                id="batch_size"
                type="number"
                {...register("batch_size", { valueAsNumber: true })}
              />
              {errors.batch_size && (
                <p className="text-sm text-destructive">{errors.batch_size.message}</p>
              )}
              <p className="text-xs text-muted-foreground">Common: 32, 64, 128</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gamma">Discount Factor (Gamma)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[watchedValues.gamma]}
                  onValueChange={([value]) => setValue("gamma", value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="flex-1"
                />
                <span className="w-16 text-right font-mono text-sm">
                  {watchedValues.gamma.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Typical: 0.99</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exploration Parameters */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Exploration Parameters
          </CardTitle>
          <CardDescription>Configure epsilon-greedy exploration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="epsilon_start">Epsilon Start</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[watchedValues.epsilon_start]}
                  onValueChange={([value]) => setValue("epsilon_start", value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="flex-1"
                />
                <span className="w-16 text-right font-mono text-sm">
                  {watchedValues.epsilon_start.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="epsilon_end">Epsilon End</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[watchedValues.epsilon_end]}
                  onValueChange={([value]) => setValue("epsilon_end", value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="flex-1"
                />
                <span className="w-16 text-right font-mono text-sm">
                  {watchedValues.epsilon_end.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="epsilon_decay">Epsilon Decay</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[watchedValues.epsilon_decay]}
                  onValueChange={([value]) => setValue("epsilon_decay", value)}
                  min={0.9}
                  max={0.9999}
                  step={0.0001}
                  className="flex-1"
                />
                <span className="w-20 text-right font-mono text-sm">
                  {watchedValues.epsilon_decay.toFixed(4)}
                </span>
              </div>
            </div>
          </div>

          {/* Epsilon Preview */}
          <div className="rounded-lg border border-border bg-secondary/50 p-4">
            <p className="text-sm font-medium text-muted-foreground">Exploration Preview</p>
            <div className="mt-2 flex items-center gap-8">
              <div>
                <p className="text-xs text-muted-foreground">Start</p>
                <p className="text-lg font-semibold">{(watchedValues.epsilon_start * 100).toFixed(0)}%</p>
              </div>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${watchedValues.epsilon_start * 100}%` }}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End</p>
                <p className="text-lg font-semibold">{(watchedValues.epsilon_end * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <AnimatePresence>
          {submitResult && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`flex items-center gap-2 text-sm ${
                submitResult.success ? "text-accent" : "text-destructive"
              }`}
            >
              {submitResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {submitResult.message}
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" disabled={isSubmitting} className="ml-auto gap-2">
          {isSubmitting && <Spinner className="h-4 w-4" />}
          {isSubmitting ? "Validating..." : "Validate Configuration"}
        </Button>
      </div>
    </form>
  )
}

export default function TrainPage() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Configure Training</h1>
          <p className="mt-1 text-muted-foreground">
            Set up hyperparameters for your DQN training run
          </p>
        </div>

        <Suspense fallback={<div className="flex items-center justify-center py-12"><Spinner /></div>}>
          <TrainForm />
        </Suspense>
      </div>
    </PageWrapper>
  )
}
