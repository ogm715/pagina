"use client"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useCart } from "@/context/CartContext"
import { formatCOP } from "@/site.config"

type User = {
  nombre: string
  direccion: string
  ciudad: string
  email: string
  telefono: string
}

export default function CheckoutSummary() {
  const { items, total } = useCart()
  const [user, setUser] = useState<User | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      setUser(raw ? JSON.parse(raw) : null)
    } catch { setUser(null) }
  }, [])

  const [numericTotal, setNumericTotal] = useState(0)
  const [priceMap, setPriceMap] = useState<Record<string, number>>({})
  useEffect(() => {
    const unknown = items.filter(it => typeof it.price !== 'number').map(it => it.image)
    if (unknown.length) {
      fetch('/api/products/resolve-prices', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ images: Array.from(new Set(unknown)) }) })
        .then(r=>r.json())
        .then(d => setPriceMap(Object.fromEntries(Object.entries(d.prices||{}).filter(([,v]) => typeof v === 'number') as [string, number][])))
        .catch(()=> setPriceMap({}))
    } else {
      setPriceMap({})
    }
  }, [items])
  useEffect(() => {
    let sum = 0
    for (const it of items) {
      const unit = typeof it.price === 'number' ? it.price : priceMap[it.image]
      if (typeof unit === 'number') sum += unit * it.qty
    }
    setNumericTotal(sum)
  }, [items, priceMap])

  async function payWithMercadoPago() {
    setErr(null)
    setBusy(true)
    try {
      // Asegurar precios numéricos para todos los items
      let currentMap = { ...priceMap }
      const missing = items.filter(it => typeof it.price !== 'number' && currentMap[it.image] === undefined)
      if (missing.length) {
        try {
          const resp = await fetch('/api/products/resolve-prices', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ images: Array.from(new Set(missing.map(m => m.image))) }) })
          const data = await resp.json()
          const resolved: Record<string, number> = {}
          for (const [k,v] of Object.entries(data?.prices || {})) {
            if (typeof v === 'number') resolved[k] = v
          }
          currentMap = { ...currentMap, ...resolved }
        } catch {}
      }

      const payload = {
        items: items.map(it => {
          const unit = typeof it.price === 'number' ? it.price : currentMap[it.image]
          return { title: it.title, quantity: it.qty, unit_price: unit ?? 0, currency_id: 'COP', picture_url: it.image }
        }).filter(x => x.unit_price > 0),
        external_reference: `order-${Date.now()}`,
        payer: user ? { name: user.nombre, email: user.email } : undefined,
      }
      if (!payload.items.length) {
        const without = items.filter(it => typeof it.price !== 'number' && !currentMap[it.image]).map(it => `• ${it.title}`)
        throw new Error(`Faltan precios numéricos en:\n${without.join('\n')}`)
      }

      const r = await fetch('/api/checkout/mp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!r.ok) {
        let details = ''
        try {
          const j = await r.json()
          details = j?.error || j?.details || ''
          if (j?.debug) {
            const dbg = typeof j.debug === 'string' ? j.debug : JSON.stringify(j.debug)
            details = details ? `${details}\n\nDebug: ${dbg}` : `Debug: ${dbg}`
          }
        } catch {}
        throw new Error(details || 'No fue posible generar el pago. Verifica configuración de Mercado Pago (token) y URLs de retorno.')
      }
      const data = await r.json()
      if (!data.init_point) throw new Error('Respuesta inválida de Mercado Pago')
      window.location.href = data.init_point
    } catch (e: any) {
      setErr(e?.message || 'Error iniciando pago')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1 className="page-title">Resumen de compra</h1>
      {err && <p className="modal__error" style={{ marginTop: 8 }}>{err}</p>}

      {!items.length ? (
        <div className="under-construction" style={{ marginTop: 12 }}>
          <p>Tu carrito está vacío.</p>
          <p>
            <Link href="/" className="nav__link">Volver a la tienda</Link>
          </p>
        </div>
      ) : (
        <div style={{ display:'grid', gap:16, gridTemplateColumns:'1fr', alignItems:'start', marginTop: 12 }}>
          <section aria-label="Productos" className="card" style={{ background:'#fff', border:'1px solid rgba(0,0,0,.12)', borderRadius:12, padding:12 }}>
            <strong style={{ display:'block', marginBottom:8 }}>Artículos</strong>
            <div style={{ display:'grid', gap:10 }}>
              {items.map(p => (
                <div key={p.id} style={{ display:'grid', gridTemplateColumns:'64px 1fr auto', gap:10, alignItems:'center' }}>
                  <img src={p.image} alt="" style={{ width:64, height:64, objectFit:'cover', borderRadius:8, border:'1px solid rgba(0,0,0,.08)' }} />
                  <div>
                    <div style={{ fontWeight:700 }}>{p.title}</div>
                    <div style={{ opacity:.8, fontSize:14 }}>
                      {p.size || ''}{p.size && (typeof p.price==='number' || typeof priceMap[p.image]==='number') ? ' · ' : ''}
                      {(() => { const pr = typeof p.price==='number' ? p.price : priceMap[p.image]; return typeof pr==='number' ? `$ ${formatCOP(pr)}` : '' })()}
                    </div>
                    <div style={{ opacity:.8, fontSize:14 }}>Cantidad: {p.qty}</div>
                  </div>
                  <div style={{ fontWeight:700 }}>
                    {(() => { const pr = typeof p.price==='number' ? p.price : priceMap[p.image]; return typeof pr==='number' ? `$ ${formatCOP(pr * p.qty)}` : '-' })()}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:12, borderTop:'1px solid rgba(0,0,0,.08)', paddingTop:10 }}>
              <span>Total</span>
              <strong>$ {formatCOP(numericTotal)}</strong>
            </div>
          </section>

          <section aria-label="Datos del cliente" className="card" style={{ background:'#fff', border:'1px solid rgba(0,0,0,.12)', borderRadius:12, padding:12 }}>
            <strong style={{ display:'block', marginBottom:8 }}>Datos del cliente</strong>
            {user ? (
              <div style={{ display:'grid', gap:6 }}>
                <div><b>Nombre:</b> {user.nombre}</div>
                <div><b>Dirección:</b> {user.direccion}</div>
                <div><b>Ciudad:</b> {user.ciudad}</div>
                <div><b>Email:</b> {user.email}</div>
                <div><b>Teléfono:</b> {user.telefono}</div>
              </div>
            ) : (
              <p className="text-muted">No encontramos tus datos. Regístrate desde “Mi cuenta”.</p>
            )}
          </section>

          <section aria-label="Pago" className="card" style={{ background:'#fff', border:'1px solid rgba(0,0,0,.12)', borderRadius:12, padding:12 }}>
            <strong style={{ display:'block', marginBottom:8 }}>Pago</strong>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <span style={{ opacity:.85 }}>Total a pagar</span>
              <strong>$ {formatCOP(numericTotal)}</strong>
            </div>
          <div style={{ display:'grid', gap:10, justifyItems:'start' }}>
              <div style={{ fontWeight:700 }}>Mercado Pago</div>
              <button className="btn btn-primary" onClick={payWithMercadoPago} disabled={busy}>
                {busy ? 'Redirigiendo…' : 'Pagar con Mercado Pago'}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
