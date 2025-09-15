import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function DELETE(_req: NextRequest, ctx: any){
  const { name } = (ctx?.params || {}) as { name: string }
  const safe = String(name || '').replace(/[^a-zA-Z0-9._-]+/g, '')
  if (!safe) return NextResponse.json({ error: 'invalid name' }, { status: 400 })
  const dir = path.join(process.cwd(), 'public', 'promos')
  try {
    const file = path.join(dir, safe)
    if (!file.startsWith(dir)) return NextResponse.json({ error: 'invalid path' }, { status: 400 })
    if (fs.existsSync(file)) fs.unlinkSync(file)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'delete failed' }, { status: 500 })
  }
}
