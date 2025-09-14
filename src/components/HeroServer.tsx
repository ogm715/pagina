import fs from 'fs'
import path from 'path'
import Hero from './Hero'

export default function HeroServer(){
  const pub = path.join(process.cwd(), 'public', 'hero')
  let mp4 = ''
  let webm = ''
  let poster = ''
  try {
    const files = fs.readdirSync(pub)
    for (const f of files) {
      const ext = path.extname(f).toLowerCase()
      if (!mp4 && ext === '.mp4') mp4 = '/hero/' + f
      if (!webm && ext === '.webm') webm = '/hero/' + f
      if (!poster && (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp')) {
        if (/poster/i.test(f)) poster = '/hero/' + f
      }
    }
    // Si no hay archivo llamado poster, usa la primera imagen disponible
    if (!poster) {
      const img = (fs.readdirSync(pub).find(f => ['.jpg','.jpeg','.png','.webp'].includes(path.extname(f).toLowerCase())))
      if (img) poster = '/hero/' + img
    }
  } catch {}

  return <Hero mp4Src={mp4} webmSrc={webm} poster={poster} />
}

