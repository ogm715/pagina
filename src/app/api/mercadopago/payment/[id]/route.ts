import { NextRequest, NextResponse } from 'next/server'

async function fetchPayment(id: string, token: string){
  const r = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!r.ok) throw new Error(`MP payment fetch failed: ${r.status}`)
  return r.json()
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }){
  const { id } = await ctx.params
  const token = process.env.MP_ACCESS_TOKEN
  if (!token) return NextResponse.json({ error: 'Missing MP_ACCESS_TOKEN' }, { status: 500 })
  try {
    const p = await fetchPayment(String(id), token)
    return NextResponse.json({
      id: p.id,
      status: p.status,
      status_detail: p.status_detail,
      payment_type_id: p.payment_type_id,
      payment_method_id: p.payment_method?.id || p.payment_method_id,
      external_reference: p.external_reference,
      transaction_amount: p.transaction_amount,
      currency_id: p.currency_id,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unable to fetch payment' }, { status: 502 })
  }
}

