import { NextRequest, NextResponse } from 'next/server'
import { findPriceByImage } from '@/lib/products-server'

export async function POST(req: NextRequest){
  try {
    const body = await req.json() as { images: string[] }
    const out: Record<string, number | null> = {}
    for (const img of body.images || []){
      const p = findPriceByImage(img)
      out[img] = typeof p === 'number' ? p : null
    }
    return NextResponse.json({ prices: out })
  } catch {
    return NextResponse.json({ prices: {} })
  }
}

