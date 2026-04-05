import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/data/index.json`,
      { cache: "no-store" }
    )
    
    if (!response.ok) {
      return NextResponse.json({ sessions: [] })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    // Fallback to empty sessions if fetch fails
    return NextResponse.json({ sessions: [] })
  }
}
