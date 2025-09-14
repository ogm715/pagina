import { NextRequest, NextResponse } from "next/server"
import crypto from 'crypto'
import { createOrder } from '@/lib/orders'

type MPItem = {
  title: string
  quantity: number
  unit_price: number
  currency_id?: string
  picture_url?: string
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.MP_ACCESS_TOKEN
    if (!token) {
      return NextResponse.json({ error: "MP_ACCESS_TOKEN not configured" }, { status: 500 })
    }

    const body = await req.json().catch(() => null) as null | {
      items: MPItem[]
      external_reference?: string
      payer?: { name?: string; email?: string }
    }
    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    // Basic validation: only numeric prices and positive quantities
    const items = body.items
      .filter((it) => typeof it.unit_price === 'number' && it.unit_price > 0 && it.quantity > 0)
      .map((it) => ({
        title: it.title,
        quantity: Math.max(1, Math.floor(it.quantity)),
        unit_price: Number(it.unit_price.toFixed(2)),
        currency_id: it.currency_id || 'COP',
        picture_url: it.picture_url,
      }))

    if (!items.length) {
      return NextResponse.json({ error: "No valid items with numeric prices" }, { status: 400 })
    }

    // Build absolute base URL for back_urls (MP requires absolute URLs)
    let base = (process.env.NEXT_PUBLIC_APP_ORIGIN || '').trim()
    if (!base) {
      const proto = (req.headers.get('x-forwarded-proto') || req.nextUrl.protocol || 'http:').replace(/:$/, '')
      const host = req.headers.get('host') || req.nextUrl.host || ''
      if (host) base = `${proto}://${host}`
    }
    if (!base && req.headers.get('origin')) base = String(req.headers.get('origin'))
    base = (base || '').replace(/\/$/, '')
    if (!/^https?:\/\//i.test(base)) {
      return NextResponse.json({ error: 'Missing app origin. Set NEXT_PUBLIC_APP_ORIGIN to an absolute URL (e.g. http://localhost:3000).' }, { status: 400 })
    }

    // Create pending order
    const orderId = crypto.randomUUID()
    const external_reference = orderId
    const total = items.reduce((a, b) => a + b.unit_price * b.quantity, 0)
    createOrder({
      id: orderId,
      external_reference,
      status: 'pending',
      items: items.map(i => ({ title: i.title, quantity: i.quantity, unit_price: i.unit_price, picture_url: i.picture_url })),
      total,
      payer: body.payer,
      mp: {},
    })

    // Optional payment method restrictions via env
    const excludeMethods = (process.env.MP_EXCLUDE_METHODS || '').split(',').map(s => s.trim()).filter(Boolean)
    const excludeTypes = (process.env.MP_EXCLUDE_TYPES || '').split(',').map(s => s.trim()).filter(Boolean)

    const preferencePayload = {
      items,
      external_reference,
      payer: body.payer,
      back_urls: {
        success: `${base}/checkout/success`,
        failure: `${base}/checkout/failure`,
        pending: `${base}/checkout/pending`,
      },
      notification_url: `${base}/api/mercadopago/webhook`,
      auto_return: 'approved' as const,
      statement_descriptor: 'DISIENTO',
      payment_methods: (excludeMethods.length || excludeTypes.length) ? {
        excluded_payment_methods: excludeMethods.map(id => ({ id })),
        excluded_payment_types: excludeTypes.map(id => ({ id })),
      } : undefined,
    }

    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferencePayload),
    })

    if (!r.ok) {
      const raw = await r.text().catch(() => '')
      let parsed: any = null
      try { parsed = raw ? JSON.parse(raw) : null } catch {}
      const causes = Array.isArray(parsed?.causes) ? parsed.causes.map((c: any) => c?.description || c?.code).filter(Boolean).join('; ') : ''
      const mpMsg = parsed?.message || parsed?.error_description || parsed?.error || ''
      const detailMsg = [mpMsg, causes].filter(Boolean).join(' · ')
      const hint = (String(token).startsWith('APP_USR-') && (r.status === 401 || r.status === 403))
        ? 'Tu cuenta/credencial no está habilitada para producción. Prueba con TEST-... o habilita producción.'
        : ''
      const message = detailMsg || raw || hint || 'Failed to create preference'
      // Add debug info for URL validation issues
      return NextResponse.json({
        error: message,
        status: r.status,
        debug: {
          base,
          back_urls: preferencePayload?.back_urls,
          auto_return: preferencePayload?.auto_return,
        }
      }, { status: 502 })
    }

    const data = await r.json() as { id: string; init_point?: string; sandbox_init_point?: string }
    return NextResponse.json({ id: data.id, init_point: data.init_point || data.sandbox_init_point, external_reference })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}
