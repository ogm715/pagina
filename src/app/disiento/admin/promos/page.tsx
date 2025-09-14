"use client"
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { isAdmin } from '@/lib/admin'

type PromoFile = { name: string; url: string; size: number }

export default function AdminPromosPage(){
  const [auth, setAuth] = useState(false)
  const [list, setList] = useState<PromoFile[]>([])
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement|null>(null)

  useEffect(() => {
    if (!isAdmin()) { window.location.href = '/disiento/admin'; return }
    setAuth(true)
    load()
  }, [])

  async function load(){
    const r = await fetch('/api/promos', { cache: 'no-store' })
    const j = await r.json()
    setList(j.files || [])
  }

  async function onFilesSelected(files: FileList | null){
    if (!files || !files.length) return
    setBusy(true)
    try {
      for (const f of Array.from(files)){
        const fd = new FormData()
        fd.set('file', f)
        fd.set('root', 'promos')
        fd.set('folder', '')
        await fetch('/api/upload', { method: 'POST', body: fd })
      }
      await load()
    } finally { setBusy(false); if (inputRef.current) inputRef.current.value = '' }
  }

  async function remove(name: string){
    if (!confirm('¿Eliminar esta imagen de destacados?')) return
    setBusy(true)
    try {
      await fetch(`/api/promos/${encodeURIComponent(name)}`, { method: 'DELETE' })
      await load()
    } finally { setBusy(false) }
  }

  if (!auth) return null

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 }}>
        <h1 className="page-title">Destacados (Promos)</h1>
        <Link href="/disiento/admin" className="btn">← Volver</Link>
      </div>

      <div className="card" style={{ background:'#fff', border:'1px solid rgba(0,0,0,.12)', borderRadius:12, padding:12, marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={e=>onFilesSelected(e.target.files)} />
          <button className="btn btn-primary" onClick={()=>inputRef.current?.click()} disabled={busy}>Subir imágenes</button>
          {busy && <span className="text-muted">Procesando…</span>}
        </div>
        <small className="text-muted" style={{ display:'block', marginTop:6 }}>Se mostrarán en el carrusel en orden alfabético. Formatos: JPG, PNG, WEBP, AVIF.</small>
      </div>

      {list.length ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:12 }}>
          {list.map(f => (
            <div key={f.name} className="card" style={{ background:'#fff', border:'1px solid rgba(0,0,0,.12)', borderRadius:12, padding:10 }}>
              <img src={f.url} alt={f.name} style={{ width:'100%', height:140, objectFit:'cover', borderRadius:8, border:'1px solid rgba(0,0,0,.08)' }} />
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
                <div style={{ fontSize:12, opacity:.8, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'60%' }}>{f.name}</div>
                <button className="btn btn-ghost" onClick={()=>remove(f.name)} disabled={busy}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">Aún no hay imágenes en destacados. Sube una o más.</p>
      )}
    </main>
  )
}

