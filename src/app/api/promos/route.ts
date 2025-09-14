import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(_req: NextRequest){
  try {
    const dir = path.join(process.cwd(), 'public', 'promos')
    fs.mkdirSync(dir, { recursive: true })
    const files = fs.readdirSync(dir)
    const exts = new Set(['.jpg','.jpeg','.png','.webp','.avif'])
    const list = files
      .filter(f => exts.has(path.extname(f).toLowerCase()))
      .sort()
      .map(name => ({ name, url: `/promos/${name}`, size: fs.statSync(path.join(dir, name)).size }))
    return NextResponse.json({ files: list })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unable to list promos' }, { status: 500 })
  }
}

