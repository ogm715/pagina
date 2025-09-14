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

export const metadata = { title: 'Cuadros óleo pastel' }

export default function OleoPastelPage() {
  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1 className="page-title">Cuadros óleo pastel</h1>
      <p className="page-subtitle">Obras a color · seleccione una categoría</p>
      <div className="grid-cats">
        {CATS.map((c) => {
          const slug = c.replace(/\s+/g,'-')
          return (
            <Link key={c} className="cat-card" aria-label={c} href={`/c/oleo-pastel/${slug}`}>
              <span className="cat-title">{c}</span>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
