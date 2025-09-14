"use client"
import { createContext, useContext, useMemo, useState } from "react"
import RegisterModal from "@/components/RegisterModal"

type RegisterUI = {
  openRegister: (after?: () => void) => void
  closeRegister: () => void
}

const Ctx = createContext<RegisterUI | null>(null)

export function RegisterProvider({ children }: { children: React.ReactNode }){
  const [open, setOpen] = useState(false)
  const [after, setAfter] = useState<null | (() => void)>(null)
  const api = useMemo<RegisterUI>(() => ({
    openRegister: (fn?: () => void) => { setAfter(() => fn || null); setOpen(true) },
    closeRegister: () => setOpen(false),
  }), [])
  return (
    <Ctx.Provider value={api}>
      {children}
      <RegisterModal
        open={open}
        onClose={()=>setOpen(false)}
        onSuccess={()=>{ try { after?.() } finally { setAfter(null); setOpen(false) } }}
      />
    </Ctx.Provider>
  )
}

export function useRegister(){
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useRegister must be used within RegisterProvider')
  return ctx
}
