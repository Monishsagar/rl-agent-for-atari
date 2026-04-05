"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { EpsilonValue } from "@/lib/types"

interface EpsilonChartProps {
  data: EpsilonValue[]
}

export function EpsilonChart({ data }: EpsilonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          domain={[0, 1]}
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
          formatter={(value: number) => [value.toFixed(4), "Epsilon"]}
        />
        <Line
          type="monotone"
          dataKey="epsilon"
          stroke="oklch(0.72 0.15 165)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
