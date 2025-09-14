"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRegister } from "@/context/RegisterContext"
import { useCart } from "@/context/CartContext"

export default function Navbar() {
  // Navbar siempre visible (flotante, no se oculta en scroll)
  const { count, setOpen } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { openRegister } = useRegister()

  // Bloquear scroll cuando el menú móvil esté abierto y cerrar con ESC
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = mobileOpen ? 'hidden' : prev || ''
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    if (mobileOpen) window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [mobileOpen])

  return (
    <header className={"navbar"} aria-label="Barra de navegación">
      <div className={"navbar__bar"}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="navbar__inner">
            <Link href="/" className="navbar__brand" aria-label="Inicio">
              <img src="/logo-disiento.svg" alt="Logo Disiento" className="logo" />
            </Link>

            {/* Botón hamburguesa (solo móvil) */}
            <button
              className="hamburger-btn"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
              onClick={()=>setMobileOpen(v=>!v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
              </svg>
            </button>

            <nav className="navbar__menu" aria-label="Categorías">
              <Link className="nav__link" href="/c/carboncillo">Cuadros en carboncillo</Link>
              <Link className="nav__link" href="/c/oleo-pastel">Cuadros óleo pastel</Link>
              <Link className="nav__link" href="/ropa-accesorios">Ropa y accesorios</Link>
              <Link className="nav__link" href="/hogar">Hogar</Link>
            </nav>

            <nav className="navbar__actions" aria-label="Acciones">
              <button className="btn btn-primary" onClick={()=>openRegister()}>Mi cuenta</button>
              <button className="icon-btn cart" aria-label="Carrito" onClick={()=>setOpen(true)}>
                <svg className="cart__icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h9v-2h-9l1.1-2h5.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1h-14zm-1 18c-1.1 0-1.99-.9-1.99-2s.89-2 1.99-2 2 .9 2 2-.9 2-2 2zm12 0c-1.1 0-1.99-.9-1.99-2s.89-2 1.99-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
                {count>0 && <span className="badge">{count}</span>}
              </button>
            </nav>
          </div>
        </div>
      </div>
      {/* Menú móvil overlay (siempre montado para animar entrada/salida) */}
      <div className={`navmobile ${mobileOpen ? 'is-open' : ''}`} onClick={()=>setMobileOpen(false)}>
        <div className="navmobile__panel" onClick={e=>e.stopPropagation()}>
          <div className="navmobile__header">
            <strong>Menú</strong>
            <button className="icon-btn navmobile__close" aria-label="Cerrar" onClick={()=>setMobileOpen(false)}>×</button>
          </div>
          <nav className="navmobile__list" aria-label="Categorías">
            <Link className="navmobile__link" href="/c/carboncillo" onClick={()=>setMobileOpen(false)}>Cuadros en carboncillo</Link>
            <Link className="navmobile__link" href="/c/oleo-pastel" onClick={()=>setMobileOpen(false)}>Cuadros óleo pastel</Link>
            <Link className="navmobile__link" href="/ropa-accesorios" onClick={()=>setMobileOpen(false)}>Ropa y accesorios</Link>
            <Link className="navmobile__link" href="/hogar" onClick={()=>setMobileOpen(false)}>Hogar</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
