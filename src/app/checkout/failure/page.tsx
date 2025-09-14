import Link from 'next/link'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

async function fetchPaymentInfo(id?: string){
  if (!id) return null
  try {
    const hdrs = headers()
    const envBase = (process.env.NEXT_PUBLIC_APP_ORIGIN || '').trim()
    const proto = (hdrs.get('x-forwarded-proto') || 'http').replace(/:$/, '')
    const host = hdrs.get('host') || ''
    const base = envBase || (host ? `${proto}://${host}` : '')
    if (!base) return null
    const r = await fetch(`${base}/api/mercadopago/payment/${encodeURIComponent(id)}`, { cache: 'no-store' })
    if (!r.ok) return null
    return r.json()
  } catch { return null }
}

export default async function FailurePage({ searchParams }: { searchParams: Promise<Record<string, string>> }){
  const sp = await searchParams
  const paymentId = sp?.payment_id || sp?.collection_id || ''
  const info = await fetchPaymentInfo(paymentId)
  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1 className="page-title">Pago rechazado</h1>
      <div className="under-construction" style={{ marginTop: 12 }}>
        <p>El pago no pudo ser procesado. Inténtalo nuevamente o prueba otro método.</p>
        {info && (
          <p className="text-muted">Estado: {info.status || '-'}{info.status_detail ? ` · ${info.status_detail}` : ''}{info.payment_type_id ? ` · ${info.payment_type_id}` : ''}</p>
        )}
        <p>
          <Link href="/checkout" className="nav__link">Volver al checkout</Link>
        </p>
      </div>
    </main>
  )
}
