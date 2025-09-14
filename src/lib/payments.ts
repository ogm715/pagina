import type { CartItem } from '@/context/CartContext'
import { PAYMENT, formatCOP } from '@/site.config'

function encode(text: string){
  return encodeURIComponent(text)
}

export function buildWhatsAppCheckoutUrl(items: CartItem[], total: number){
  const lines: string[] = []
  lines.push('Hola, quiero confirmar mi pedido:')
  lines.push('')
  if (items.length) {
    for (const it of items){
      const unit = typeof it.price === 'number' ? `$ ${formatCOP(it.price)}` : ''
      const sub = typeof it.price === 'number' ? `$ ${formatCOP(it.price * it.qty)}` : ''
      lines.push(`• ${it.title}${it.size?` (${it.size})`:''} × ${it.qty}${unit?` · ${unit}`:''}${sub?` · Subtotal: ${sub}`:''}`)
    }
  }
  lines.push('')
  lines.push(`Total: $ ${formatCOP(total)}`)
  lines.push('')
  lines.push('Forma de pago: Mercado Pago')
  lines.push('')
  lines.push('Nota: Para retratos personalizados, realizo 50% de anticipo y 50% al finalizar.')
  const text = encode(lines.join('\n'))
  const phone = PAYMENT.WHATSAPP_NUMBER.replace(/\D+/g,'')
  return `https://wa.me/${phone}?text=${text}`
}
