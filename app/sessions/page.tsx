"use client"

import { useState } from "react"
import useSWR from "swr"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { SessionComparisonChart } from "@/components/charts/session-comparison-chart"
import { Session, Metrics } from "@/lib/types"
import { format } from "date-fns"
import { History, GitCompare } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function SessionsPage() {
  const [selectedSessions, setSelectedSessions] = useState<string[]>([])
  
  const { data: sessionsData, isLoading } = useSWR<{ sessions: Session[] }>("/api/sessions", fetcher)
  
  // Fetch metrics for selected sessions for comparison
  const { data: metricsData } = useSWR<Metrics[]>(
    selectedSessions.length > 0
      ? selectedSessions.map((id) => `/api/metrics/${id}`)
      : null,
    async (urls: string[]) => {
      const results = await Promise.all(urls.map((url) => fetch(url).then((res) => res.json())))
      return results
    }
  )

  const sessions = sessionsData?.sessions || []

  const toggleSession = (sessionId: string) => {
    setSelectedSessions((prev) => {
      if (prev.includes(sessionId)) {
        return prev.filter((id) => id !== sessionId)
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), sessionId]
      }
      return [...prev, sessionId]
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-accent text-accent-foreground"
      case "running":
        return "bg-chart-1 text-foreground"
      case "stopped":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Training Sessions</h1>
          <p className="mt-1 text-muted-foreground">
            View and compare past training runs
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sessions Table */}
          <div className="lg:col-span-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Past Sessions
                </CardTitle>
                <CardDescription>
                  Select up to 3 sessions to compare (click checkbox)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Compare</TableHead>
                        <TableHead>Session</TableHead>
                        <TableHead>Game</TableHead>
                        <TableHead>Episodes</TableHead>
                        <TableHead>Best Reward</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow
                          key={session.session_id}
                          className={
                            selectedSessions.includes(session.session_id)
                              ? "bg-primary/5"
                              : ""
                          }
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedSessions.includes(session.session_id)}
                              onCheckedChange={() => toggleSession(session.session_id)}
                            />
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {session.session_id}
                          </TableCell>
                          <TableCell>{session.game}</TableCell>
                          <TableCell>{session.total_episodes.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold text-accent">
                            {session.best_reward.toFixed(1)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(session.created_at), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Comparison Panel */}
          <div>
            <Card className="border-border bg-card sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5" />
                  Comparison
                </CardTitle>
                <CardDescription>
                  {selectedSessions.length === 0
                    ? "Select sessions to compare"
                    : `Comparing ${selectedSessions.length} session${selectedSessions.length > 1 ? "s" : ""}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedSessions.length === 0 ? (
                  <div className="flex h-[200px] items-center justify-center text-center text-sm text-muted-foreground">
                    Select up to 3 sessions from the table to compare their reward curves
                  </div>
                ) : metricsData ? (
                  <SessionComparisonChart
                    sessions={metricsData}
                    selectedIds={selectedSessions}
                  />
                ) : (
                  <Skeleton className="h-[200px] w-full" />
                )}

                {selectedSessions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {selectedSessions.map((id, index) => {
                      const session = sessions.find((s) => s.session_id === id)
                      const colors = ["oklch(0.65 0.18 250)", "oklch(0.72 0.15 165)", "oklch(0.75 0.18 85)"]
                      return session ? (
                        <div
                          key={id}
                          className="flex items-center gap-3 rounded-lg border border-border p-2"
                        >
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: colors[index] }}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{session.game}</p>
                            <p className="text-xs text-muted-foreground">{id}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {session.best_reward.toFixed(1)}
                          </Badge>
                        </div>
                      ) : null
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
