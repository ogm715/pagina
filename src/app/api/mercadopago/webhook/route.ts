import { NextRequest, NextResponse } from 'next/server'
import { updateOrder } from '@/lib/orders'

async function fetchPayment(id: string, token: string){
  const r = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!r.ok) throw new Error(`MP payment fetch failed: ${r.status}`)
  return r.json()
}

export async function POST(req: NextRequest){
  const token = process.env.MP_ACCESS_TOKEN
  if (!token) return NextResponse.json({ ok: true })

  try {
    const body = await req.json().catch(() => ({} as any))
    const type = body?.type || body?.action || req.nextUrl.searchParams.get('type')
    const dataId = body?.data?.id || req.nextUrl.searchParams.get('data.id')

    if (type === 'payment' && dataId) {
      const p = await fetchPayment(String(dataId), token)
      const ext = p.external_reference as string | undefined
      const status = String(p.status || '').toLowerCase()
      const status_detail = String(p.status_detail || '')
      const payment_method_id = String(p.payment_method?.id || p.payment_method_id || '')
      const payment_type_id = String(p.payment_type_id || '')
      if (ext) {
        updateOrder(ext, {
          status: (status === 'approved' ? 'approved' : (status === 'rejected' ? 'rejected' : (status === 'in_process' ? 'in_process' : 'pending'))),
          mp: { paymentId: String(p.id), status, status_detail, payment_method_id, payment_type_id },
        })
      }
    }
  } catch (e) {
    // swallow to not retry-loop; MP expects 200
  }
  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest){
  // Some MP configs send GET pings
  return NextResponse.json({ ok: true })
}
