"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ActionDistribution } from "@/lib/types"

interface ActionProbabilityChartProps {
  data: ActionDistribution[]
}

const COLORS = [
  "oklch(0.65 0.18 250)",
  "oklch(0.72 0.15 165)",
  "oklch(0.75 0.18 85)",
  "oklch(0.60 0.20 340)",
  "oklch(0.65 0.20 30)",
  "oklch(0.55 0.15 200)",
]

export function ActionProbabilityChart({ data }: ActionProbabilityChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    probability: item.probability * 100,
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
        <XAxis
          type="number"
          domain={[0, 100]}
          stroke="oklch(0.6 0 0)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis
          type="category"
          dataKey="action"
          stroke="oklch(0.6 0 0)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "oklch(0.12 0 0)",
            border: "1px solid oklch(0.22 0 0)",
            borderRadius: "8px",
            color: "oklch(0.98 0 0)",
          }}
          formatter={(value: number) => [`${value.toFixed(1)}%`, "Probability"]}
        />
        <Bar dataKey="probability" radius={[0, 4, 4, 0]}>
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
