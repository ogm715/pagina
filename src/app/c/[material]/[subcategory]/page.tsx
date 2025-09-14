import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { PAYMENT } from '@/site.config'

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

export function generateStaticParams() {
  const params: { material: string; subcategory: string }[] = []
  for (const m of MATERIALS) for (const c of CATS) params.push({ material: m, subcategory: c })
  return params
}

export function generateMetadata({ params }: { params: { material: string; subcategory: string } }) {
  const title = `Galería · ${params.material} · ${params.subcategory.replace(/-/g,' ')}`
  return { title }
}

export default function GalleryPage({ params }: { params: { material: string; subcategory: string } }) {
  const material = String(params.material)
  const sub = String(params.subcategory)
  const isValid = MATERIALS.includes(material as any) && CATS.includes(sub as any)

  let images: { src: string; alt: string; file: string }[] = []
  if (isValid) {
    const pub = path.join(process.cwd(), 'public')
    const relDir = path.join('galeria', material, sub)
    const fullDir = path.join(pub, relDir)
    try {
      const files = fs.readdirSync(fullDir)
      const exts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
      images = files
        .filter(f => exts.has(path.extname(f).toLowerCase()))
        .map(f => ({ src: `/${relDir}/${f}`, alt: f.replace(/[-_]/g,' ').replace(/\.[^.]+$/, ''), file: f }))
    } catch {}
  }

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1 className="page-title" style={{ textTransform:'capitalize' }}>Galería · {material} · {sub.replace(/-/g,' ')}</h1>
      {sub === 'retratos-personalizados' && (
        <section style={{ marginTop: 8, marginBottom: 12 }} aria-label="Retratos personalizados">
          <h2 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 800 }}>
            Retratos Personalizados de Mascotas y Personas
          </h2>
          <p style={{ margin: '0 0 6px 0', color:'#333', lineHeight: 1.6 }}>
            Convierte esa foto especial en una obra de arte única.
          </p>
          <p style={{ margin: 0, color:'#333', lineHeight: 1.6 }}>
            Escríbenos por WhatsApp para enviarnos la imagen, elegir el tamaño que prefieras y la técnica que más te guste. Nosotros nos encargamos de crear un retrato que destaque los detalles y la esencia de tu mascota o ser querido.
          </p>
          <div style={{ marginTop: 10 }}>
            {(() => {
              const phone = PAYMENT.WHATSAPP_NUMBER.replace(/\D+/g,'')
              const text = encodeURIComponent('Hola, quiero un retrato personalizado. Te envío la foto. Tamaño: __. Técnica: __.')
              const href = `https://wa.me/${phone}?text=${text}`
              return (
                <a className="btn btn-primary" href={href} target="_blank" rel="noopener noreferrer">
                  Enviar foto por WhatsApp
                </a>
              )
            })()}
          </div>
        </section>
      )}
      <section className="gallery-wall">
        {images.length ? (
          <div className="gallery-grid">
            {images.map((img, i) => (
              <Link key={i} href={`/c/${material}/${sub}/${encodeURIComponent(img.file)}`} className="frame art-frame" aria-label={img.alt}>
                <div className="frame__inner">
                  <img src={img.src} alt={img.alt} className="frame__img" loading="lazy" decoding="async" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="gallery-empty">
            <p>No hay imágenes aún para esta categoría.</p>
            <p>Sube archivos a <code>tienda-disiento/public/galeria/{material}/{sub}/</code> (jpg, png, webp) y recarga.</p>
          </div>
        )}
      </section>
    </main>
  )
}
