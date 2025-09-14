import fs from 'fs'
import path from 'path'

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

const dataDir = path.join(process.cwd(), 'data')
const filePath = path.join(dataDir, 'products.json')

function ensureFile(){
  try { fs.mkdirSync(dataDir, { recursive: true }) } catch {}
  if (!fs.existsSync(filePath)) {
    try { fs.writeFileSync(filePath, '[]', 'utf8') } catch {}
  }
}

export function listProducts(filter?: Partial<Pick<Product,'category'|'subcategory'>>): Product[] {
  ensureFile()
  try {
    const all = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Product[]
    if (!filter) return all
    return all.filter(p => (
      (filter.category ? p.category === filter.category : true) &&
      (filter.subcategory ? p.subcategory === filter.subcategory : true)
    ))
  } catch { return [] }
}

export function getProductById(id: string): Product | undefined {
  return listProducts().find(p => p.id === id)
}

function slugify(s: string){
  return s
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}+/gu, '')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'')
}

export function upsertProductServer(p: Product): Product {
  ensureFile()
  const all = listProducts()
  let id = p.id && p.id.trim() ? p.id.trim() : ''
  if (!id) {
    const base = slugify(`${p.title || 'producto'}-${p.category || 'cat'}`)
    let candidate = base || `p-${Date.now()}`
    let i = 1
    while (all.some(x => x.id === candidate)) { candidate = `${base}-${++i}` }
    id = candidate
  }
  const payload: Product = { ...p, id }
  const idx = all.findIndex(x => x.id === id)
  if (idx >= 0) all[idx] = payload; else all.push(payload)
  fs.writeFileSync(filePath, JSON.stringify(all, null, 2), 'utf8')
  return payload
}

export function deleteProductServer(id: string): boolean {
  ensureFile()
  const all = listProducts().filter(p => p.id !== id)
  fs.writeFileSync(filePath, JSON.stringify(all, null, 2), 'utf8')
  return true
}

export function findPriceByImage(image: string): number | undefined {
  const file = String(image||'').split('/').pop()
  for (const p of listProducts()){
    if (p.image === image || String(p.image||'').split('/').pop() === file) {
      if (typeof p.price === 'number') return p.price
      const raw = String(p.price||'').replace(/[.,\s]/g,'')
      if (/^\d+$/.test(raw)) return Number(raw)
    }
  }
  return undefined
}
