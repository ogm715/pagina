import Link from "next/link"

const CATS = [
  'retratos personalizados',
  'paisajes',
  'animales',
  'abstractos',
  'futbol',
  'urbanos',
  'religiosos',
  'bodegones',
]

export const metadata = { title: 'Cuadros en carboncillo' }

export default function CarboncilloPage() {
  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1 className="page-title">Cuadros en carboncillo</h1>
      <p className="page-subtitle">Seleccione una categoría</p>
      <div className="grid-cats">
        {CATS.map((c) => {
          const slug = c.replace(/\s+/g,'-')
          return (
            <Link key={c} href={`/c/carboncillo/${slug}`} className="cat-card" aria-label={c}>
              <span className="cat-title">{c}</span>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
