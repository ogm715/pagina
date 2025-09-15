import { NextRequest, NextResponse } from 'next/server'
import { deleteProductServer, getProductById } from '@/lib/products-server'

export async function GET(_req: NextRequest, ctx: any){
  const { id } = (ctx?.params || {}) as { id: string }
  const p = getProductById(id)
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ product: p })
}

export async function DELETE(_req: NextRequest, ctx: any){
  const { id } = (ctx?.params || {}) as { id: string }
  deleteProductServer(id)
  return NextResponse.json({ ok: true })
}
