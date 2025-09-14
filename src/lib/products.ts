export type Product = {
  id?: string
  title: string
  category: 'carboncillo' | 'oleo-pastel' | 'ropa-accesorios' | 'hogar'
  subcategory: string
  price?: number | string
  size?: string
  image?: string
  images?: string[]
  desc?: string
  stock?: number
}

const KEY = 'products-v1'

export function loadProducts(): Product[] {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : [] } catch { return [] }
}

export function saveProducts(list: Product[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch {}
}

export function upsertProduct(p: Product) {
  const list = loadProducts()
  const idx = list.findIndex(x => x.id === p.id)
  if (idx >= 0) list[idx] = p; else list.push(p)
  saveProducts(list)
}

export function deleteProduct(id: string) {
  const list = loadProducts().filter(x => x.id !== id)
  saveProducts(list)
}
