"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RewardChart } from "@/components/charts/reward-chart"
import { EpsilonChart } from "@/components/charts/epsilon-chart"
import { LossChart } from "@/components/charts/loss-chart"
import { QValueHistogram } from "@/components/charts/q-value-histogram"
import { Session, Metrics } from "@/lib/types"
import { TrendingUp, TrendingDown, Activity, Target } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DashboardPage() {
  const [selectedSession, setSelectedSession] = useState<string>("")

  const { data: sessionsData } = useSWR<{ sessions: Session[] }>("/api/sessions", fetcher)
  const { data: metricsData, isLoading: metricsLoading } = useSWR<Metrics>(
    selectedSession ? `/api/metrics/${selectedSession}` : null,
    fetcher,
    { refreshInterval: 3000 }
  )

  useEffect(() => {
    if (sessionsData?.sessions?.length && !selectedSession) {
      setSelectedSession(sessionsData.sessions[0].session_id)
    }
  }, [sessionsData, selectedSession])

  const sessions = sessionsData?.sessions || []
  const metrics = metricsData

  const latestReward = metrics?.episode_rewards?.[metrics.episode_rewards.length - 1]?.reward || 0
  const firstReward = metrics?.episode_rewards?.[0]?.reward || 0
  const rewardTrend = latestReward > firstReward
  
  const latestEpsilon = metrics?.epsilon_values?.[metrics.epsilon_values.length - 1]?.epsilon || 1
  const latestLoss = metrics?.loss_values?.[metrics.loss_values.length - 1]?.loss || 0

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Training Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Monitor training progress in real-time
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map((session) => (
                  <SelectItem key={session.session_id} value={session.session_id}>
                    {session.session_id} - {session.game}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {metrics && (
              <Badge variant="outline" className="text-accent border-accent">
                {metrics.game}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Latest Reward
              </CardTitle>
              {rewardTrend ? (
                <TrendingUp className="h-4 w-4 text-accent" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-bold">{latestReward.toFixed(1)}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Epsilon
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-bold">{latestEpsilon.toFixed(3)}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Latest Loss
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-bold">{latestLoss.toFixed(4)}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Episodes
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-bold">
                  {metrics?.episode_rewards?.[metrics.episode_rewards.length - 1]?.episode || 0}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Episode Rewards</CardTitle>
              <CardDescription>Reward per episode over training</CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : metrics?.episode_rewards ? (
                <RewardChart data={metrics.episode_rewards} />
              ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  Select a session to view metrics
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Epsilon Decay</CardTitle>
              <CardDescription>Exploration rate over episodes</CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : metrics?.epsilon_values ? (
                <EpsilonChart data={metrics.epsilon_values} />
              ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  Select a session to view metrics
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Loss Curve</CardTitle>
              <CardDescription>Training loss over timesteps</CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : metrics?.loss_values ? (
                <LossChart data={metrics.loss_values} />
              ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  Select a session to view metrics
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Q-Value Distribution</CardTitle>
              <CardDescription>Histogram of predicted Q-values</CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : metrics?.q_values ? (
                <QValueHistogram data={metrics.q_values} />
              ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  Select a session to view metrics
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Hyperparameters */}
        {metrics?.hyperparameters && (
          <Card className="mt-6 border-border bg-card">
            <CardHeader>
              <CardTitle>Hyperparameters</CardTitle>
              <CardDescription>Training configuration for this session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                {Object.entries(metrics.hyperparameters).map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-border bg-secondary/50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="mt-1 text-lg font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageWrapper>
  )
}
