"use client"
import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

type Clothing = { id: string; title: string; image?: string; price?: number | string }

const SIZES = ['S','M','L','XL'] as const

export default function ClothingCard({ p, href }: { p: Clothing, href?: string }) {
  const { add, setOpen } = useCart()
  const [size, setSize] = useState<string>('M')
  const [qty, setQty] = useState(1)
  return (
    <article className="cloth">
      {href ? (
        <Link href={href} className="cloth__media" aria-label={`Ver detalles de ${p.title}`}>
          {p.image ? <img src={p.image} alt={p.title} /> : <div className="cloth__placeholder">IMG</div>}
        </Link>
      ) : (
        <div className="cloth__media">
          {p.image ? <img src={p.image} alt={p.title} /> : <div className="cloth__placeholder">IMG</div>}
        </div>
      )}
      <div className="cloth__body">
        <h3 className="cloth__title">{p.title}</h3>
        <div className="cloth__price">{
          typeof p.price === 'number' ? `$ ${new Intl.NumberFormat('es-CO').format(p.price)}` : (p.price || '—')
        }</div>
        <div className="cloth__controls">
          <div className="sizes" role="radiogroup" aria-label="Talla">
            {SIZES.map(s => (
              <button key={s} className={`size ${size===s?'is-active':''}`} aria-pressed={size===s} onClick={()=>setSize(s)}>{s}</button>
            ))}
          </div>
          <div className="qty">
            <button className="qty__btn" onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
            <input className="qty__input" value={qty} onChange={e=>setQty(Math.max(1, parseInt(e.target.value||'1')))} />
            <button className="qty__btn" onClick={()=>setQty(q=>q+1)}>+</button>
          </div>
        </div>
        <button className="btn btn-primary" onClick={()=>{ const price = typeof p.price === 'number' ? p.price : undefined; add({ id: `${p.id}-${size}`, title: `${p.title} (${size})`, price, image: p.image||'', size }, qty); setOpen(true) }}>Comprar</button>
      </div>
    </article>
  )
}
