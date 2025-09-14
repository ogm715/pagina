"use client"
import { useEffect, useMemo, useState } from 'react'
import BuyBar from '@/components/BuyBar'
// Pago únicamente por Mercado Pago desde el checkout

export default function ClientArtDetail({ material, subcategory, file, imgPath }: { material: string; subcategory: string; file: string; imgPath: string }) {
  const fallbackTitle = useMemo(() => file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '), [file])
  const [product, setProduct] = useState<any>(null)
  useEffect(() => {
    let alive = true
    // Buscar producto por ruta/nombre de imagen en categorías de arte
    fetch(`/api/products?category=${encodeURIComponent(material)}`, { cache:'no-store' })
      .then(r=>r.json())
      .then(d => {
        if (!alive) return
        const list = (d.products||[]) as any[]
        const exact = list.find(p => p.image === imgPath)
        if (exact) { setProduct(exact); return }
        const fn = file
        const byName = list.find(p => String(p.image||'').split('/').pop() === fn)
        setProduct(byName || null)
      })
      .catch(() => { if (alive) setProduct(null) })
    return () => { alive = false }
  }, [material, imgPath, file])

  const title = product?.title || fallbackTitle
  const size = product?.size || ''
  const price = typeof product?.price === 'number' ? product?.price : undefined
  const desc = product?.desc || ''
  const id = product?.id || `${material}-${subcategory}-${fallbackTitle}`

  return (
    <div className="product">
      <div className="product__media">
        <figure className="frame art-frame" style={{ margin:0 }}>
          <div className="frame__inner">
            <img src={imgPath} alt={title} className="frame__img" />
          </div>
        </figure>
      </div>
      <aside className="product__info">
        <h1 className="product__title">{title}</h1>
        {size && <p className="product__meta">Medidas: <strong>{size}</strong></p>}
        {price !== undefined && (
          <p className="product__price">Precio: <strong>$ {new Intl.NumberFormat('es-CO').format(price)}</strong></p>
        )}
        {desc && <p className="product__desc">{desc}</p>}
        {subcategory === 'retratos-personalizados' && (
          <div style={{ margin:'10px 0 12px' }}>
            <h2 style={{ margin:'0 0 6px 0', fontSize:'1.1rem', fontWeight:800 }}>Retratos personalizados de mascotas y personas</h2>
            <p style={{ margin:'0 0 6px 0', color:'#333', lineHeight:1.5 }}>Convierte esa foto especial en una obra de arte única.</p>
            <p style={{ margin:0, color:'#333', lineHeight:1.6 }}>Escríbenos por WhatsApp para enviarnos la imagen, elegir el tamaño que prefieras y la técnica que más te guste. Nosotros nos encargamos de crear un retrato que destaque los detalles y la esencia de tu mascota o ser querido.</p>
          </div>
        )}
        {subcategory === 'retratos-personalizados' && (
          <div style={{ border:'1px solid rgba(0,0,0,.12)', borderRadius:12, padding:12, background:'#fff', margin:'10px 0 12px' }}>
            <strong>Anticipo 50% para retratos personalizados</strong>
            <p style={{ margin:'6px 0 10px', color:'#333', lineHeight:1.5 }}>
              Para iniciar tu retrato cobro el 50% y el 50% restante al finalizar la obra.
              {typeof price === 'number' && (
                <> Anticipo estimado: <b>$ {new Intl.NumberFormat('es-CO').format(Math.round(price * 0.5))}</b>.</>
              )}
            </p>
            <p style={{ margin:0, color:'#333' }}>Pagos únicamente por Mercado Pago desde el checkout.</p>
            <small style={{ display:'block', marginTop:6, opacity:.8 }}>También puedes escribirnos por WhatsApp desde el carrito.</small>
          </div>
        )}
        <BuyBar product={{ id, title, image: imgPath, price, size }} />
      </aside>
    </div>
  )
}
