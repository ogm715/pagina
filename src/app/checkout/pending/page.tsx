import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function PendingPage() {
  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1 className="page-title">Pago pendiente</h1>
      <div className="under-construction" style={{ marginTop: 12 }}>
        <p>Tu pago está en proceso de validación. Te notificaremos cuando se confirme.</p>
        <p className="text-muted">Si cerraste la ventana por error, puedes intentar nuevamente desde el checkout.</p>
        <p>
          <Link href="/checkout" className="nav__link">Volver al checkout</Link>
        </p>
      </div>
    </main>
  )
}

