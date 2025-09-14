import Link from "next/link"
import Client from "./Client"

const GENDERS = ['hombre','mujer'] as const
const KINDS = ['camisetas','camisas','gorras'] as const

export function generateStaticParams() {
  const params: { gender: string; kind: string }[] = []
  for (const g of GENDERS) for (const k of KINDS) params.push({ gender: g, kind: k })
  return params
}

export default function ClothingListPage({ params }: { params: { gender: string; kind: string } }) {
  const gender = String(params.gender)
  const kind = String(params.kind)
  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <nav style={{ marginBottom: 12 }}><Link href="/ropa-accesorios" className="nav__link">← Volver</Link></nav>
      <Client gender={gender} kind={kind} />
    </main>
  )
}
