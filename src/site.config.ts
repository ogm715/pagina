export const PAYMENT = {
  // Reemplaza con tu número en formato internacional sin + (ej: 57 + celular)
  WHATSAPP_NUMBER: '573161342246',
}

export function formatCOP(n: number){
  return new Intl.NumberFormat('es-CO').format(n)
}
