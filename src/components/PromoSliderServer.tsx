import fs from 'fs'
import path from 'path'
import PromoSlider from './PromoSlider'

export default function PromoSliderServer(){
  const pub = path.join(process.cwd(), 'public', 'promos')
  let slides: { src: string; alt?: string }[] = []
  try {
    const files = fs.readdirSync(pub)
    const exts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
    slides = files
      .filter(f => exts.has(path.extname(f).toLowerCase()))
      .sort() // orden alfabético
      .map((f, i) => ({ src: '/promos/' + f, alt: `Promoción ${i+1}` }))
  } catch {}
  return <PromoSlider slides={slides} />
}

