"use client"
import { useState } from "react"
import { useCart } from "@/context/CartContext"

type Product = { id: string; title: string; image: string; price?: number; size?: string }

export default function BuyBar({ product, onBuy }: { product: Product; onBuy?: (qty: number)=>void }) {
  const [qty, setQty] = useState(1)
  const { add, setOpen } = useCart()
  const dec = () => setQty(q => Math.max(1, q - 1))
  const inc = () => setQty(q => q + 1)
  return (
    <div className="buybar">
      <div className="qty">
        <button type="button" className="qty__btn" aria-label="Disminuir" onClick={dec}>−</button>
        <input className="qty__input" type="number" min={1} value={qty} onChange={e=>setQty(Math.max(1, Number(e.target.value)||1))} />
        <button type="button" className="qty__btn" aria-label="Aumentar" onClick={inc}>+</button>
      </div>
      <button className="btn btn-primary" type="button" onClick={()=> { add(product, qty); setOpen(true); onBuy && onBuy(qty) }}>Comprar</button>
    </div>
  )
}
