import fs from 'fs'
import path from 'path'

export type OrderItem = { title: string; quantity: number; unit_price: number; picture_url?: string }
export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'in_process'

export type Order = {
  id: string
  external_reference: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  payer?: { name?: string; email?: string }
  mp?: {
    preferenceId?: string
    paymentId?: string
    merchantOrderId?: string
    status?: string
    status_detail?: string
    payment_method_id?: string
    payment_type_id?: string
  }
  createdAt: string
  updatedAt: string
}

const dataDir = path.join(process.cwd(), 'data')
const filePath = path.join(dataDir, 'orders.json')

function ensureFile(){
  try { fs.mkdirSync(dataDir, { recursive: true }) } catch {}
  if (!fs.existsSync(filePath)) {
    try { fs.writeFileSync(filePath, '[]', 'utf8') } catch {}
  }
}

export function listOrders(): Order[] {
  ensureFile()
  try { const raw = fs.readFileSync(filePath, 'utf8'); return JSON.parse(raw) } catch { return [] }
}

export function saveOrders(list: Order[]) {
  ensureFile()
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8')
}

export function createOrder(data: Omit<Order, 'createdAt'|'updatedAt'>): Order {
  const now = new Date().toISOString()
  const order: Order = { ...data, createdAt: now, updatedAt: now }
  const all = listOrders()
  all.push(order)
  saveOrders(all)
  return order
}

export function getOrderByExternalRef(ext: string): Order | undefined {
  return listOrders().find(o => o.external_reference === ext)
}

export function updateOrder(ext: string, patch: Partial<Order>): Order | undefined {
  const all = listOrders()
  const idx = all.findIndex(o => o.external_reference === ext)
  if (idx === -1) return undefined
  const prev = all[idx]
  const next: Order = { ...prev, ...patch, updatedAt: new Date().toISOString(), mp: { ...prev.mp, ...patch.mp } }
  all[idx] = next
  saveOrders(all)
  return next
}
