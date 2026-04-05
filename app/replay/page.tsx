"use client"

import { useState } from "react"
import useSWR from "swr"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ActionProbabilityChart } from "@/components/charts/action-probability-chart"
import { Session, Metrics } from "@/lib/types"
import { PlayCircle, Info, Gamepad2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Placeholder replays data
const replays = [
  {
    id: "replay-001",
    session_id: "session-001",
    game: "Breakout",
    episode: 950,
    reward: 384.0,
    duration: "2:35",
    thumbnail: "/images/breakout.jpg",
  },
  {
    id: "replay-002",
    session_id: "session-002",
    game: "Pong",
    episode: 750,
    reward: 20.5,
    duration: "1:45",
    thumbnail: "/images/pong.jpg",
  },
  {
    id: "replay-003",
    session_id: "session-003",
    game: "Space Invaders",
    episode: 1100,
    reward: 1195.0,
    duration: "3:20",
    thumbnail: "/images/space-invaders.jpg",
  },
]

export default function ReplayPage() {
  const [selectedReplay, setSelectedReplay] = useState(replays[0].id)
  
  const currentReplay = replays.find((r) => r.id === selectedReplay)
  
  const { data: metricsData, isLoading } = useSWR<Metrics>(
    currentReplay ? `/api/metrics/${currentReplay.session_id}` : null,
    fetcher
  )

  const actionDistribution = metricsData?.action_distribution || []

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Episode Replay</h1>
            <p className="mt-1 text-muted-foreground">
              Watch pre-rendered agent gameplay with action analysis
            </p>
          </div>
          
          <Select value={selectedReplay} onValueChange={setSelectedReplay}>
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Select replay" />
            </SelectTrigger>
            <SelectContent>
              {replays.map((replay) => (
                <SelectItem key={replay.id} value={replay.id}>
                  {replay.game} - Episode {replay.episode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="border-border bg-card overflow-hidden">
              <div className="aspect-video relative bg-secondary">
                {currentReplay && (
                  <>
                    <img
                      src={currentReplay.thumbnail}
                      alt={currentReplay.game}
                      className="h-full w-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 backdrop-blur">
                          <PlayCircle className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{currentReplay.game}</p>
                          <p className="text-sm text-muted-foreground">
                            Episode {currentReplay.episode}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                        Duration: {currentReplay.duration}
                      </Badge>
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                        Reward: {currentReplay.reward}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>
                    Pre-rendered gameplay from training session. In production, this would be a GIF or MP4 file.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Probabilities */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gamepad2 className="h-5 w-5" />
                  Action Distribution
                </CardTitle>
                <CardDescription>
                  Average action probabilities for this episode
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : actionDistribution.length > 0 ? (
                  <ActionProbabilityChart data={actionDistribution} />
                ) : (
                  <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                    No action data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Episode Info */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Episode Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentReplay && (
                  <>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span className="text-sm text-muted-foreground">Game</span>
                      <span className="font-medium">{currentReplay.game}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span className="text-sm text-muted-foreground">Episode</span>
                      <span className="font-medium">{currentReplay.episode}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span className="text-sm text-muted-foreground">Total Reward</span>
                      <span className="font-medium text-accent">{currentReplay.reward}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="font-medium">{currentReplay.duration}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span className="text-sm text-muted-foreground">Session</span>
                      <span className="font-mono text-sm">{currentReplay.session_id}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Replay Gallery */}
        <Card className="mt-8 border-border bg-card">
          <CardHeader>
            <CardTitle>Available Replays</CardTitle>
            <CardDescription>Select a replay to view</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {replays.map((replay) => (
                <button
                  key={replay.id}
                  onClick={() => setSelectedReplay(replay.id)}
                  className={`group relative overflow-hidden rounded-lg border transition-all ${
                    selectedReplay === replay.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="aspect-video overflow-hidden bg-secondary">
                    <img
                      src={replay.thumbnail}
                      alt={replay.game}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{replay.game}</span>
                      <Badge variant="outline">Ep {replay.episode}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Reward: {replay.reward}
                    </p>
                  </div>
                  {selectedReplay === replay.id && (
                    <div className="absolute right-2 top-2">
                      <Badge className="bg-primary text-primary-foreground">Playing</Badge>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
