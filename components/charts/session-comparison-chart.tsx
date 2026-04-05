"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Metrics } from "@/lib/types"

interface SessionComparisonChartProps {
  sessions: Metrics[]
  selectedIds: string[]
}

const COLORS = [
  "oklch(0.65 0.18 250)",
  "oklch(0.72 0.15 165)",
  "oklch(0.75 0.18 85)",
]

export function SessionComparisonChart({ sessions, selectedIds }: SessionComparisonChartProps) {
  // Normalize data for comparison
  const maxEpisode = Math.max(
    ...sessions.flatMap((s) => s.episode_rewards.map((r) => r.episode))
  )
  
  // Create unified data points
  const episodes = Array.from({ length: 20 }, (_, i) => Math.round((i + 1) * (maxEpisode / 20)))
  
  const chartData = episodes.map((episode) => {
    const dataPoint: Record<string, number | string> = { episode }
    
    sessions.forEach((session, index) => {
      const sessionId = selectedIds[index]
      const closest = session.episode_rewards.reduce((prev, curr) =>
        Math.abs(curr.episode - episode) < Math.abs(prev.episode - episode) ? curr : prev
      )
      dataPoint[sessionId] = closest.reward
    })
    
    return dataPoint
  })

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0 0)" />
        <XAxis
          dataKey="episode"
          stroke="oklch(0.6 0 0)"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <YAxis
          stroke="oklch(0.6 0 0)"
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "oklch(0.12 0 0)",
            border: "1px solid oklch(0.22 0 0)",
            borderRadius: "8px",
            color: "oklch(0.98 0 0)",
            fontSize: "12px",
          }}
          labelFormatter={(label) => `Episode ${label}`}
        />
        <Legend
          wrapperStyle={{ fontSize: "10px" }}
          formatter={(value) => value.split("-").slice(-1)[0]}
        />
        {selectedIds.map((sessionId, index) => (
          <Line
            key={sessionId}
            type="monotone"
            dataKey={sessionId}
            stroke={COLORS[index]}
            strokeWidth={2}
            dot={false}
            name={sessionId}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
