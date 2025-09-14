import { NextRequest, NextResponse } from 'next/server'
import { listOrders } from '@/lib/orders'

export async function GET(_req: NextRequest){
  const list = listOrders()
  return NextResponse.json({ orders: list })
}

