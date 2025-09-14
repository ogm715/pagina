"use client"
import { useEffect, useMemo, useState } from "react"
import ClothingCard from "@/components/ClothingCard"
import type { Product } from "@/lib/products"

export default function Client({ gender, kind }: { gender: string; kind: string }) {
  const sub = `${gender}-${kind}`
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    let alive = true
    const refresh = async () => {
      const d = await fetch(`/api/products?category=ropa-accesorios&subcategory=${encodeURIComponent(sub)}`, { cache:'no-store' }).then(r=>r.json()).catch(()=>({products:[]}))
      if (!alive) return
      setItems(d.products || [])
    }
    refresh()
    return () => { alive = false }
  }, [sub])

  const title = useMemo(() => `${gender[0].toUpperCase()+gender.slice(1)} · ${kind}`, [gender, kind])

  return (
    <>
      <h1 className="page-title" style={{ textTransform:'capitalize' }}>{title}</h1>
      {items.length ? (
        <div className="cloth-grid">
          {items.map(p => (
            <ClothingCard
              key={p.id}
              p={{ id: p.id, title: p.title, image: (p as any).images?.[0] || p.image, price: p.price }}
              href={`/ropa-accesorios/${gender}/${kind}/${encodeURIComponent(p.id)}`}
            />
          ))}
        </div>
      ) : (
        <div className="gallery-empty"><p>No hay productos aquí todavía. Crea algunos en el panel admin y vuelve a esta vista.</p></div>
      )}
    </>
  )
}
