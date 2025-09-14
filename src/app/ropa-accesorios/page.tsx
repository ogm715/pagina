export const metadata = { title: 'Ropa y accesorios' }

const HOMBRE = ['camisetas', 'camisas', 'gorras']
const MUJER = ['camisetas', 'camisas', 'gorras']

export default function RopaAccesoriosPage() {
  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1 className="page-title">Ropa y accesorios</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ marginTop: 16 }}>
        <section className="cat-group">
          <h2 className="group-title">Hombre</h2>
          <div className="grid-cats">
            {HOMBRE.map((c) => (
              <a key={c} className="cat-card" href={`/ropa-accesorios/hombre/${c}`}> <span className="cat-title">{c}</span></a>
            ))}
          </div>
        </section>
        <section className="cat-group">
          <h2 className="group-title">Mujer</h2>
          <div className="grid-cats">
            {MUJER.map((c) => (
              <a key={c} className="cat-card" href={`/ropa-accesorios/mujer/${c}`}> <span className="cat-title">{c}</span></a>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
