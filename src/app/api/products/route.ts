import { NextRequest, NextResponse } from 'next/server'
import { listProducts, upsertProductServer, type Product } from '@/lib/products-server'

export async function GET(req: NextRequest){
  const { searchParams } = req.nextUrl
  const category = searchParams.get('category') as Product['category'] | null
  const subcategory = searchParams.get('subcategory')
  const list = listProducts({ category: category || undefined, subcategory: subcategory || undefined })
  return NextResponse.json({ products: list })
}

export async function POST(req: NextRequest){
  try {
    const body = await req.json() as Product
    const saved = upsertProductServer(body)
    return NextResponse.json({ product: saved })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Invalid payload' }, { status: 400 })
  }
}
