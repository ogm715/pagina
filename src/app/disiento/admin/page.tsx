"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { adminLogin, adminLogout, isAdmin } from "@/lib/admin"
import type { Product } from "@/lib/products"

const ART_SUBS = ['retratos-personalizados','paisajes','animales','abstractos','futbol','urbanos','religiosos','bodegones'] as const
const CLOTH_SUBS = ['hombre-camisetas','hombre-camisas','hombre-gorras','mujer-camisetas','mujer-camisas','mujer-gorras'] as const

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [items, setItems] = useState<Product[]>([])
  const [editing, setEditing] = useState<Product|null>(null)

  useEffect(() => {
    setAuth(isAdmin())
    if (isAdmin()) {
      fetch('/api/products', { cache: 'no-store' })
        .then(r => r.json())
        .then(d => setItems(d.products || []))
        .catch(()=> setItems([]))
    }
  }, [])

  if (!auth) return <Login onOk={()=>{
    setAuth(true);
    fetch('/api/products', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setItems(d.products || []))
  }} />

  // Sin datos de demo en producción

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 }}>
        <h1 className="page-title">Panel administrador</h1>
        <div style={{ display:'flex', gap:8 }}>
          <a className="btn" href="/disiento/admin/orders">Órdenes</a>
          <a className="btn" href="/disiento/admin/promos">Destacados</a>
          <button className="btn btn-primary" onClick={()=>setEditing({ title:'', category:'carboncillo', subcategory: ART_SUBS[0], price: 0, size:'', image:'', desc:'' })}>Nuevo producto</button>
          <button className="btn btn-ghost" onClick={()=>{ adminLogout(); setAuth(false) }}>Salir</button>
        </div>
      </div>

      {items.length ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full text-sm" style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead className="text-muted">
              <tr>
                <th className="p-2 text-left">Título</th>
                <th className="p-2 text-left">Categoría</th>
                <th className="p-2 text-left">Subcategoría</th>
                <th className="p-2 text-left">Precio</th>
                <th className="p-2 text-left">Medidas</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} style={{ borderTop:'1px solid rgba(0,0,0,.08)' }}>
                  <td className="p-2">{p.title}</td>
                  <td className="p-2">{p.category}</td>
                  <td className="p-2">{p.subcategory}</td>
                  <td className="p-2">{typeof p.price === 'number' ? `$ ${new Intl.NumberFormat('es-CO').format(p.price)}` : (p.price || '-')}</td>
                  <td className="p-2">{p.size || '-'}</td>
                  <td className="p-2" style={{ display:'flex', gap:8 }}>
                    <button className="btn" onClick={()=>setEditing(p)}>Editar</button>
                    <button className="btn btn-ghost" onClick={async ()=>{ if (confirm('¿Eliminar?')) { await fetch(`/api/products/${encodeURIComponent(String(p.id))}`, { method:'DELETE' }); const d = await fetch('/api/products', { cache:'no-store' }).then(r=>r.json()); setItems(d.products||[]) } }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted">No hay productos aún. Crea el primero.</p>
      )}

      {editing && <EditModal value={editing} onClose={()=>setEditing(null)} onSave={async (p)=>{
        // Normalizar precio: si es numérico en string, guardarlo como número
        const norm = { ...p } as Product
        if (typeof (norm as any).price === 'string') {
          const raw = String((norm as any).price).replace(/[.\s,]/g,'')
          if (/^\d+$/.test(raw)) (norm as any).price = Number(raw)
        }
        await fetch('/api/products', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(norm) })
        setEditing(null)
        const d = await fetch('/api/products', { cache:'no-store' }).then(r=>r.json())
        setItems(d.products||[])
      }} />}
    </main>
  )
}

function Login({ onOk }: { onOk: ()=>void }) {
  const [e, setE] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState('')
  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <div className="modal__dialog" style={{ margin:'10vh auto', maxWidth:420 }}>
        <div className="modal__header"><h3 className="modal__title">Acceso administrador</h3></div>
        {err && <p className="modal__error" style={{ margin:'8px 16px 0' }}>{err}</p>}
        <form className="modal__content" onSubmit={(ev)=>{ ev.preventDefault(); if (adminLogin(e.trim(), p)) onOk(); else setErr('Credenciales inválidas') }}>
          <label className="field"><span>Usuario</span><input value={e} onChange={ev=>setE(ev.target.value)} required /></label>
          <label className="field"><span>Contraseña</span><input type="password" value={p} onChange={ev=>setP(ev.target.value)} required /></label>
          <div className="modal__actions"><button className="btn btn-primary">Ingresar</button></div>
        </form>
      </div>
    </main>
  )
}

function EditModal({ value, onClose, onSave }: { value: Product, onClose: ()=>void, onSave: (p: Product)=>void }) {
  const [p, setP] = useState<Product>(value)
  const subs = useMemo(() => p.category==='carboncillo'||p.category==='oleo-pastel' ? ART_SUBS : (p.category==='ropa-accesorios' ? CLOTH_SUBS : (['general'] as const)), [p.category])
  useEffect(()=>{ if (!subs.includes(p.subcategory as any)) setP(prev => ({ ...prev, subcategory: subs[0] })) }, [subs])
  const fileRefs = [useRef<HTMLInputElement|null>(null), useRef<HTMLInputElement|null>(null), useRef<HTMLInputElement|null>(null)]
  const pickFile = (i: number) => fileRefs[i].current?.click()
  const setImageAt = (i: number, src: string) => setP(prev => {
    const imgs = (prev.images ? [...prev.images] : [])
    while (imgs.length < 3) imgs.push('')
    imgs[i] = src
    return { ...prev, images: imgs, image: imgs[0] || prev.image }
  })
  const onFileChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const folder = p.category === 'ropa-accesorios'
      ? `ropa-accesorios/${p.subcategory}`
      : `${p.category}/${p.subcategory}`
    const fd = new FormData()
    fd.set('file', f)
    fd.set('folder', folder)
    fetch('/api/upload', { method: 'POST', body: fd })
      .then(r => r.json())
      .then(data => {
        if (data?.url) {
          if (p.category === 'ropa-accesorios') {
            setImageAt(i, String(data.url))
          } else {
            setP(prev => ({ ...prev, image: String(data.url) }))
          }
          alert('Imagen subida.')
        } else {
          alert('No se pudo subir la imagen')
        }
      })
      .catch(() => alert('Error subiendo la imagen'))
      .finally(() => { e.target.value = '' })
  }
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__dialog" onClick={e=>e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{value.id ? 'Editar' : 'Nuevo'} producto</h3>
          <button className="icon-btn" aria-label="Cerrar" onClick={onClose}>×</button>
        </div>
        <form className="modal__content" onSubmit={(ev)=>{ ev.preventDefault(); if (!p.title.trim()) { alert('Título requerido'); return } onSave(p) }}>
          <div style={{ display:'grid', gap:12, gridTemplateColumns:'1fr 1fr' }}>
            <label className="field"><span>Título</span><input value={p.title} onChange={e=>setP({ ...p, title: e.target.value })} required /></label>
            <label className="field" style={{ gridColumn:'1 / -1' }}><span>Descripción</span><input value={p.desc||''} onChange={e=>setP({ ...p, desc: e.target.value })} /></label>
            <label className="field"><span>Categoría</span>
              <select value={p.category} onChange={e=>setP({ ...p, category: e.target.value as any })}>
                <option value="carboncillo">carboncillo</option>
                <option value="oleo-pastel">oleo-pastel</option>
                <option value="ropa-accesorios">ropa-accesorios</option>
                <option value="hogar">hogar</option>
              </select>
            </label>
            <label className="field"><span>Subcategoría</span>
              <select value={p.subcategory} onChange={e=>setP({ ...p, subcategory: e.target.value })}>
                {subs.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="field"><span>Medidas</span><input value={p.size||''} onChange={e=>setP({ ...p, size: e.target.value })} placeholder="30x40 cm" /></label>
            <label className="field"><span>Precio</span><input value={String(p.price ?? '')} onChange={e=>setP({ ...p, price: e.target.value })} placeholder="Ej: 120000 o 'a convenir'" /></label>
            {p.category === 'ropa-accesorios' ? (
              <div className="field" style={{ gridColumn:'1 / -1' }}>
                <span>Imágenes (Ropa y accesorios)</span>
                <div style={{ display:'grid', gap:10 }}>
                  {[0,1,2].map(i => {
                    const imgs = (p.images||[])
                    const val = imgs[i] || ''
                    return (
                      <div key={i} style={{ display:'grid', gap:6 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <input value={val} onChange={e=>setImageAt(i, e.target.value)} placeholder={i===0 ? 'URL Imagen principal (#1)' : `URL Miniatura #${i+1}`} />
                          <button type="button" className="btn" onClick={()=>pickFile(i)}>Examinar…</button>
                          <input ref={fileRefs[i]} type="file" accept="image/*" onChange={(e)=>onFileChange(i, e)} style={{ display:'none' }} />
                          {val && <img src={val} alt={`preview ${i+1}`} style={{ width:48, height:48, objectFit:'cover', borderRadius:8, border:'1px solid rgba(0,0,0,.12)' }} />}
                        </div>
                        {i===0 ? (
                          <small className="text-muted">Imagen principal (#1): se muestra de entrada y en la tarjeta</small>
                        ) : (
                          <small className="text-muted">Miniatura #{i+1}: se muestra como miniatura en el detalle</small>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="field" style={{ gridColumn:'1 / -1' }}>
                <span>Imagen</span>
                <div style={{ display:'grid', gap:8 }}>
                  <input value={p.image||''} onChange={e=>setP({ ...p, image: e.target.value })} placeholder="Pega una URL pública o usa Examinar" />
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <button type="button" className="btn" onClick={()=>pickFile(0)}>Examinar…</button>
                    <input ref={fileRefs[0]} type="file" accept="image/*" onChange={(e)=>{ onFileChange(0, e); }} style={{ display:'none' }} />
                    {p.image && (
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <img src={p.image} alt="preview" style={{ width:48, height:48, objectFit:'cover', borderRadius:8, border:'1px solid rgba(0,0,0,.12)' }} />
                        <small className="text-muted">Subida al servidor (galería)</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal__actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
