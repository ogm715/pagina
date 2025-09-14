export const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER || 'admin'
export const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || '123456'

export function isAdmin(): boolean {
  try { return localStorage.getItem('adminAuth') === 'ok' } catch { return false }
}

export function adminLogin(u: string, p: string): boolean {
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    try { localStorage.setItem('adminAuth', 'ok') } catch {}
    return true
  }
  return false
}

export function adminLogout() {
  try { localStorage.removeItem('adminAuth') } catch {}
}
