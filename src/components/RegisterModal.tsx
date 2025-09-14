"use client"
import { useEffect, useState } from "react"

type User = {
  nombre: string
  direccion: string
  ciudad: string
  email: string
  telefono: string
  password: string
}

export default function RegisterModal({ open, onClose, onSuccess }: { open: boolean; onClose: ()=>void; onSuccess?: ()=>void }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Registro de usuario" onClick={onClose}>
      <div className="modal__dialog" onClick={(e)=>e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Crear cuenta</h3>
          <button className="icon-btn" aria-label="Cerrar" onClick={onClose}>×</button>
        </div>
        {err && <p className="modal__error">{err}</p>}
        <form className="modal__content" onSubmit={(e)=>{
          e.preventDefault()
          setErr(null)
          setBusy(true)
          const f = new FormData(e.currentTarget as HTMLFormElement)
          const data: User = {
            nombre: String(f.get('nombre')||''),
            direccion: String(f.get('direccion')||''),
            ciudad: String(f.get('ciudad')||''),
            email: String(f.get('email')||''),
            telefono: String(f.get('telefono')||''),
            password: String(f.get('password')||''),
          }
          try {
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) throw new Error('Email inválido')
            if (data.password.length < 6) throw new Error('La contraseña debe tener mínimo 6 caracteres')
            // Guardar mock local (para pruebas locales)
            try { localStorage.setItem('user', JSON.stringify({ ...data, password: undefined })) } catch {}
            alert('Cuenta creada (modo local)')
            try { onSuccess?.() } finally { onClose() }
          } catch (e: any) {
            setErr(e?.message || 'Error en el registro')
          } finally {
            setBusy(false)
          }
        }}>
          <label className="field"><span>Nombre</span><input name="nombre" required /></label>
          <label className="field"><span>Dirección</span><input name="direccion" required /></label>
          <label className="field"><span>Ciudad</span><input name="ciudad" required /></label>
          <label className="field"><span>Email</span><input type="email" name="email" required /></label>
          <label className="field"><span>Teléfono</span><input name="telefono" required pattern="[+0-9\s()-]{7,}" placeholder="+57 300 000 0000" /></label>
          <label className="field"><span>Contraseña</span><input type="password" name="password" required minLength={6} /></label>
          <div className="modal__actions">
            <button className="btn btn-ghost" type="button" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" disabled={busy}>
              {busy ? 'Creando…' : 'Crear cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
