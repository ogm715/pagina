"use client"
import { useCart } from "@/context/CartContext"
import { useRegister } from "@/context/RegisterContext"
import { useRouter } from "next/navigation"

export default function CartPanel() {
  const { open, setOpen, items, setQty, remove, total, clear } = useCart()
  const { openRegister } = useRegister()
  const router = useRouter()
  return (
    <>
      <div className={`cart__backdrop ${open ? 'is-open' : ''}`} onClick={()=>setOpen(false)} />
      <aside className={`cart__panel ${open ? 'is-open' : ''}`} aria-label="Carrito de compras">
        <div className="cart__header">
          <h3 className="font-bold">Carrito</h3>
          <button className="icon-btn" aria-label="Cerrar" onClick={()=>setOpen(false)}>×</button>
        </div>
        <div className="cart__body">
          {!items.length ? (
            <p className="text-muted">Tu carrito está vacío.</p>
          ) : items.map((p) => (
            <div key={p.id} className="cart__item">
              <img src={p.image} alt="" className="cart__thumb" />
              <div className="cart__data">
                <div className="cart__title">{p.title}</div>
                <div className="cart__meta">{p.size || ''} {p.price ? `· $ ${new Intl.NumberFormat('es-CO').format(p.price)}` : ''}</div>
                <div className="qty">
                  <button className="qty__btn" onClick={()=>setQty(p.id, Math.max(1, p.qty-1))}>−</button>
                  <input className="qty__input" value={p.qty} onChange={e=>setQty(p.id, Math.max(1, parseInt(e.target.value||'1')))} />
                  <button className="qty__btn" onClick={()=>setQty(p.id, p.qty+1)}>+</button>
                  <button className="cart__remove" onClick={()=>remove(p.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="cart__footer">
          <div className="cart__summary"><span>Total:</span><strong>$ {new Intl.NumberFormat('es-CO').format(total)}</strong></div>
          <div className="cart__actions">
            <button className="btn btn-ghost" onClick={clear}>Vaciar</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                let hasUser = false
                try { hasUser = !!localStorage.getItem('user') } catch {}
                if (!hasUser) {
                  alert('Regístrate para conocer tus datos y dirección de envío')
                  openRegister(() => {
                    setOpen(false)
                    router.push('/checkout')
                  })
                  return
                }
                setOpen(false)
                router.push('/checkout')
              }}
            >
              Finalizar compra
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
