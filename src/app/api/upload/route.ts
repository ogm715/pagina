import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function sanitizeSegment(s: string){
  return s
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
}

export async function POST(req: NextRequest){
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const folder = String(form.get('folder') || '')
    const root = String(form.get('root') || 'galeria')
    if (!file) return NextResponse.json({ error: 'file missing' }, { status: 400 })
    // For galeria we require a subfolder; for promos we allow root
    if (!folder && root === 'galeria') return NextResponse.json({ error: 'folder missing' }, { status: 400 })

    // Target directory under public/<root>
    const relFolder = folder.split('/').map(sanitizeSegment).filter(Boolean).join('/')
    const safeRoot = sanitizeSegment(root)
    const allowedRoots = new Set(['galeria','promos'])
    if (!allowedRoots.has(safeRoot)) return NextResponse.json({ error: 'invalid root' }, { status: 400 })
    const baseDir = path.join(process.cwd(), 'public', safeRoot)
    const targetDir = path.join(baseDir, relFolder)
    if (!targetDir.startsWith(baseDir)) return NextResponse.json({ error: 'invalid folder' }, { status: 400 })
    fs.mkdirSync(targetDir, { recursive: true })

    // Filename
    const orig = (file.name || 'upload') as string
    const ext = path.extname(orig) || '.bin'
    const name = sanitizeSegment(path.basename(orig, ext)) || 'upload'
    let filename = `${name}${ext}`
    let targetPath = path.join(targetDir, filename)
    let i = 1
    while (fs.existsSync(targetPath)){
      filename = `${name}-${i}${ext}`
      targetPath = path.join(targetDir, filename)
      i++
    }

    const buf = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(targetPath, buf)

    const publicUrl = `/${safeRoot}/${relFolder ? relFolder + '/' : ''}${filename}`.replace(/\\/g,'/')
    return NextResponse.json({ ok: true, url: publicUrl })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'upload failed' }, { status: 500 })
  }
}
