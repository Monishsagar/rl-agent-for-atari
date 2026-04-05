import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ session: string }> }
) {
  const { session } = await params
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/data/${session}/metrics.json`,
      { cache: "no-store" }
    )
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    )
  }
}
