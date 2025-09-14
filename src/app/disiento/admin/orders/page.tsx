"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { isAdmin } from '@/lib/admin'

type Order = {
  external_reference: string
  status: string
  total: number
  createdAt: string
  updatedAt: string
  mp?: { status?: string; status_detail?: string; payment_type_id?: string; payment_method_id?: string }
}

export default function AdminOrdersPage(){
  const [ok, setOk] = useState(false)
  const [list, setList] = useState<Order[]>([])

  useEffect(() => {
    if (!isAdmin()) {
      window.location.href = '/disiento/admin'
      return
    }
    setOk(true)
    const load = async () => {
      const r = await fetch('/api/orders', { cache: 'no-store' })
      const data = await r.json()
      setList(data.orders || [])
    }
    load()
  }, [])

  if (!ok) return null

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 }}>
        <h1 className="page-title">Órdenes</h1>
        <Link href="/disiento/admin" className="btn">← Volver</Link>
      </div>
      {list.length ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full text-sm" style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead className="text-muted">
              <tr>
                <th className="p-2 text-left">Orden</th>
                <th className="p-2 text-left">Estado</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">MP</th>
                <th className="p-2 text-left">Creada</th>
                <th className="p-2 text-left">Actualizada</th>
              </tr>
            </thead>
            <tbody>
              {list.map(o => (
                <tr key={o.external_reference} style={{ borderTop:'1px solid rgba(0,0,0,.08)' }}>
                  <td className="p-2" style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>{o.external_reference}</td>
                  <td className="p-2">{o.status}</td>
                  <td className="p-2">$ {new Intl.NumberFormat('es-CO').format(o.total)}</td>
                  <td className="p-2" style={{maxWidth:280, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                    {o?.mp?.status || '-'}{o?.mp?.status_detail ? ` · ${o.mp.status_detail}` : ''}
                  </td>
                  <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="p-2">{new Date(o.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted">No hay órdenes aún.</p>
      )}
    </main>
  )
}
