"use client"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type CartItem = {
  id: string
  title: string
  image: string
  price?: number
  size?: string
  qty: number
}

type CartState = {
  open: boolean
  setOpen: (v: boolean)=>void
  items: CartItem[]
  add: (item: Omit<CartItem, 'qty'>, qty?: number)=>void
  remove: (id: string)=>void
  setQty: (id: string, qty: number)=>void
  clear: ()=>void
  count: number
  total: number
}

const Ctx = createContext<CartState | null>(null)
const STORAGE_KEY = 'cart-v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])

  // load from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])
  // persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
  }, [items])

  const api = useMemo<CartState>(() => ({
    open, setOpen,
    items,
    add: (it, qty = 1) => {
      setItems(prev => {
        const i = prev.findIndex(p => p.id === it.id)
        if (i >= 0) {
          const next = [...prev]
          next[i] = { ...next[i], qty: next[i].qty + Math.max(1, qty) }
          return next
        }
        return [...prev, { ...it, qty: Math.max(1, qty) }]
      })
    },
    remove: (id) => setItems(prev => prev.filter(p => p.id !== id)),
    setQty: (id, q) => setItems(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, q) } : p)),
    clear: () => setItems([]),
    get count() { return items.reduce((a,b)=> a + b.qty, 0) },
    get total() { return items.reduce((a,b)=> a + (typeof b.price === 'number' ? b.price * b.qty : 0), 0) },
  }), [open, setOpen, items])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
