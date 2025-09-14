import Link from 'next/link'
import { getOrderByExternalRef } from '@/lib/orders'

export const dynamic = 'force-dynamic'

async function fetchPaymentInfo(id?: string){
  if (!id) return null
  try {
    const r = await fetch(`${process.env.NEXT_PUBLIC_APP_ORIGIN || ''}/api/mercadopago/payment/${encodeURIComponent(id)}`, { cache: 'no-store' })
    if (!r.ok) return null
    return r.json()
  } catch { return null }
}

export default async function SuccessPage({ searchParams }: { searchParams: Promise<Record<string, string>> }){
  const sp = await searchParams
  const ext = sp?.external_reference || ''
  const status = (sp?.status || sp?.collection_status || '').toLowerCase()
  const paymentId = sp?.payment_id || sp?.collection_id || ''
  const order = ext ? getOrderByExternalRef(ext) : undefined
  const info = await fetchPaymentInfo(paymentId)
  const approved = (status === 'approved') || (order?.status === 'approved') || (String(info?.status||'').toLowerCase() === 'approved')

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1 className="page-title">{approved ? 'Pago aprobado' : 'Pago recibido'}</h1>
      <div className="under-construction" style={{ marginTop: 12 }}>
        {approved ? (
          <>
            <p>¡Gracias por tu compra! Confirmamos tu pago{order ? ` (orden ${order.external_reference})` : ''}.</p>
            {info && (
              <p className="text-muted">Método: {info.payment_type_id || '-'}{info.payment_method_id ? ` · ${info.payment_method_id}` : ''}</p>
            )}
            <p>
              <Link href="/" className="nav__link">Volver al inicio</Link>
            </p>
          </>
        ) : (
          <>
            <p>Recibimos tu pago y estamos validándolo. Si ya fue aprobado, verás el estado actualizado en unos instantes.</p>
            {order && <p>Orden: <b>{order.external_reference}</b> · Estado: <b>{order.status}</b></p>}
            {info && (
              <p className="text-muted">Estado: {info.status || '-'}{info.status_detail ? ` · ${info.status_detail}` : ''}</p>
            )}
            <p>
              <Link href="/" className="nav__link">Volver al inicio</Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
