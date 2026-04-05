"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { EpisodeReward } from "@/lib/types"

interface RewardChartProps {
  data: EpisodeReward[]
}

export function RewardChart({ data }: RewardChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rewardGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0 0)" />
        <XAxis
          dataKey="episode"
          stroke="oklch(0.6 0 0)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="oklch(0.6 0 0)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "oklch(0.12 0 0)",
            border: "1px solid oklch(0.22 0 0)",
            borderRadius: "8px",
            color: "oklch(0.98 0 0)",
          }}
          labelFormatter={(label) => `Episode ${label}`}
          formatter={(value: number) => [value.toFixed(2), "Reward"]}
        />
        <Area
          type="monotone"
          dataKey="reward"
          stroke="oklch(0.65 0.18 250)"
          strokeWidth={2}
          fill="url(#rewardGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
