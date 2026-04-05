"use client"

import { motion } from "framer-motion"

export function DqnDiagram() {
  const layers = [
    { name: "Input", width: 120, height: 120, color: "oklch(0.65 0.18 250)", label: "84×84×4" },
    { name: "Conv1", width: 90, height: 90, color: "oklch(0.72 0.15 165)", label: "32 filters" },
    { name: "Conv2", width: 70, height: 70, color: "oklch(0.72 0.15 165)", label: "64 filters" },
    { name: "Conv3", width: 50, height: 50, color: "oklch(0.72 0.15 165)", label: "64 filters" },
    { name: "Flatten", width: 20, height: 80, color: "oklch(0.75 0.18 85)", label: "3136" },
    { name: "FC1", width: 25, height: 60, color: "oklch(0.60 0.20 340)", label: "512" },
    { name: "Output", width: 30, height: 40, color: "oklch(0.65 0.20 30)", label: "n actions" },
  ]

  return (
    <div className="relative overflow-x-auto py-8">
      <div className="flex min-w-[800px] items-center justify-center gap-4">
        {layers.map((layer, index) => (
          <motion.div
            key={layer.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Layer visualization */}
            <div
              className="relative flex items-center justify-center rounded-lg border-2 transition-transform hover:scale-105"
              style={{
                width: layer.width,
                height: layer.height,
                borderColor: layer.color,
                backgroundColor: `color-mix(in oklch, ${layer.color} 20%, transparent)`,
              }}
            >
              <span className="text-xs font-mono text-foreground/80">{layer.label}</span>
            </div>
            
            {/* Layer name */}
            <span className="text-sm font-medium">{layer.name}</span>
            
            {/* Arrow to next layer */}
            {index < layers.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.05 }}
                className="absolute"
                style={{
                  left: `calc(${(index + 1) * (100 / layers.length)}% - 20px)`,
                  top: "50%",
                }}
              >
                <svg width="40" height="20" viewBox="0 0 40 20" className="text-muted-foreground">
                  <path
                    d="M0 10 L30 10 M25 5 L30 10 L25 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: "oklch(0.65 0.18 250)" }} />
          <span className="text-sm text-muted-foreground">Input Layer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: "oklch(0.72 0.15 165)" }} />
          <span className="text-sm text-muted-foreground">Convolutional Layers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: "oklch(0.75 0.18 85)" }} />
          <span className="text-sm text-muted-foreground">Flatten</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: "oklch(0.60 0.20 340)" }} />
          <span className="text-sm text-muted-foreground">Fully Connected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: "oklch(0.65 0.20 30)" }} />
          <span className="text-sm text-muted-foreground">Output (Q-values)</span>
        </div>
      </div>

      {/* Additional info */}
      <div className="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
        <p className="text-center text-sm text-muted-foreground">
          The network takes 4 stacked grayscale frames (84×84 pixels) as input and outputs Q-values for each possible action.
          ReLU activations are used throughout, except for the output layer which has no activation.
        </p>
      </div>
    </div>
  )
}
