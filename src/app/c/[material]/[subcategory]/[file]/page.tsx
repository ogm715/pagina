import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ClientArtDetail from './ClientArtDetail'

const MATERIALS = ['carboncillo', 'oleo-pastel'] as const
const CATS = [
  'retratos-personalizados',
  'paisajes',
  'animales',
  'abstractos',
  'futbol',
  'urbanos',
  'religiosos',
  'bodegones',
] as const

export function generateStaticParams() { return [] }

export default async function ProductDetail({ params }: { params: Promise<{ material: string; subcategory: string; file: string }> }) {
  const { material: m, subcategory: s, file: f } = await params
  const material = String(m)
  const sub = String(s)
  const file = decodeURIComponent(String(f))
  const isValid = MATERIALS.includes(material as any) && CATS.includes(sub as any)
  if (!isValid) return notFound()

  const relDir = path.join('galeria', material, sub)
  const imgPath = path.join('/' + relDir, file)

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <nav style={{ marginBottom: 12 }}>
        <Link href={`/c/${material}`} className="nav__link">← Volver a {material.replace(/-/g,' ')}</Link>
      </nav>
      <ClientArtDetail material={material} subcategory={sub} file={file} imgPath={imgPath} />
    </main>
  )
}
