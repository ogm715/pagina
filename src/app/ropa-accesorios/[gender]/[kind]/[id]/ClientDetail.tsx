"use client"
import { useEffect, useMemo, useState } from 'react'
import BuyBar from '@/components/BuyBar'

export default function ClientDetail({ gender, kind, id }: { gender: string; kind: string; id: string }) {
  const title = useMemo(() => id.replace(/[-_]/g,' '), [id])
  const sub = `${gender}-${kind}`

  const [product, setProduct] = useState<any>(null)
  useEffect(() => {
    let alive = true
    fetch(`/api/products/${encodeURIComponent(id)}`, { cache:'no-store' })
      .then(r => r.ok ? r.json() : Promise.resolve({product:null}))
      .then(d => { if (alive) setProduct(d.product || null) })
      .catch(() => { if (alive) setProduct(null) })
    return () => { alive = false }
  }, [id])
  const images = useMemo(() => {
    const imgs = (product as any)?.images as string[] | undefined
    if (imgs && imgs.length) return imgs.slice(0, 3)
    // fallback a imagen única
    if (product?.image) return [product.image]
    // fallback final: demo de la subcategoría
    return [`/galeria/ropa-accesorios/${sub}/demo-1.svg`]
  }, [product, sub])

  const [active, setActive] = useState(0)

  return (
    <div className="product">
      <div className="product__media">
        <figure className="frame" style={{ margin:0 }}>
          <div className="frame__inner">
            <img src={images[active] || images[0]} alt={title} className="frame__img" />
          </div>
        </figure>
        {images.length > 1 && (
          <div className="thumbs" style={{ display:'flex', gap:10, marginTop:12 }}>
            {images.slice(1,3).map((src, i) => (
              <div key={i} className="frame" style={{ width:120, cursor:'pointer' }}>
                <div
                  className="frame__inner"
                  onMouseEnter={()=>setActive(i+1)}
                  onFocus={()=>setActive(i+1)}
                  onClick={()=>setActive(i+1)}
                  role="button"
                  tabIndex={0}
                >
                  <img src={src} alt={`Miniatura ${i+2}`} className="frame__img" style={{ aspectRatio:'4/3', objectFit:'cover' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <aside className="product__info">
        <h1 className="product__title" style={{ textTransform:'capitalize' }}>{title}</h1>
        <BuyBar product={{ id, title: product?.title || title, image: images[active] || images[0], price: typeof product?.price==='number' ? product?.price : undefined, size: product?.size || '' }} />
      </aside>
    </div>
  )
}
