import Link from 'next/link'
import ClientDetail from './ClientDetail'

export function generateStaticParams() { return [] }

export default function ClothingDetailPage({ params }: { params: { gender: string; kind: string; id: string } }) {
  const gender = String(params.gender)
  const kind = String(params.kind)
  const id = decodeURIComponent(String(params.id))
  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <nav style={{ marginBottom: 12 }}>
        <Link href={`/ropa-accesorios/${gender}/${kind}`} className="nav__link">← Volver</Link>
      </nav>
      <ClientDetail gender={gender} kind={kind} id={id} />
    </main>
  )
}
