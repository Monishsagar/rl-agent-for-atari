import { NextResponse } from "next/server"
import { z } from "zod"

const configSchema = z.object({
  game: z.enum(["breakout", "pong", "space-invaders"]),
  total_timesteps: z.number().min(1000).max(10000000),
  learning_rate: z.number().min(0.000001).max(1),
  epsilon_start: z.number().min(0).max(1),
  epsilon_end: z.number().min(0).max(1),
  epsilon_decay: z.number().min(0).max(1),
  batch_size: z.number().int().min(1).max(512),
  gamma: z.number().min(0).max(1)
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const result = configSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed",
          details: result.error.flatten()
        },
        { status: 400 }
      )
    }
    
    // In a real app, this would save to a database or trigger training
    // For this demo, we just validate and return the config
    return NextResponse.json({
      success: true,
      config: result.data,
      message: "Configuration validated successfully. In production, this would start a training job."
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload" },
      { status: 400 }
    )
  }
}
