import { NextRequest, NextResponse } from 'next/server'
import { deleteProductServer, getProductById } from '@/lib/products-server'

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }){
  const { id } = await ctx.params
  const p = getProductById(id)
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ product: p })
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }){
  const { id } = await ctx.params
  deleteProductServer(id)
  return NextResponse.json({ ok: true })
}

