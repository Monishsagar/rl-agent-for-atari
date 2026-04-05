"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { QValueBin } from "@/lib/types"

interface QValueHistogramProps {
  data: QValueBin[]
}

export function QValueHistogram({ data }: QValueHistogramProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0 0)" />
        <XAxis
          dataKey="bin"
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
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "oklch(0.12 0 0)",
            border: "1px solid oklch(0.22 0 0)",
            borderRadius: "8px",
            color: "oklch(0.98 0 0)",
          }}
          labelFormatter={(label) => `Q-value range: ${label}`}
          formatter={(value: number) => [value, "Count"]}
        />
        <Bar
          dataKey="count"
          fill="oklch(0.60 0.20 340)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
