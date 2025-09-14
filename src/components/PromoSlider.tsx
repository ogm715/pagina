"use client"
import { useEffect, useState } from 'react'

type Slide = { src: string; alt?: string }

export default function PromoSlider({ slides }: { slides: Slide[] }){
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI(v => (v + 1) % Math.max(slides.length, 1)), 5500)
    return () => clearInterval(t)
  }, [slides.length, paused])

  const data = (slides.length ? slides : [{ src: '/promos/slide-1.webp', alt: 'Promoción' }])

  return (
    <section className="container promos" aria-label="Propaganda">
      <div className="gallery-wall promos-wall">
        <div
          className="promos__viewport promos__viewport--frame"
          role="group"
          aria-roledescription="carrusel"
          aria-label="Imágenes de propaganda"
          onMouseEnter={()=>setPaused(true)}
          onMouseLeave={()=>setPaused(false)}
          onTouchStart={()=>setPaused(true)}
          onTouchEnd={()=>setPaused(false)}
        >
          {data.map((s, idx) => (
            <div key={s.src} className={`promos__frame ${i===idx? 'is-active':''}`}>
              <div className="frame art-frame">
                <div className="frame__inner">
                  <img
                    src={s.src}
                    alt={s.alt}
                    className="frame__img"
                    loading={idx===0? 'eager':'lazy'}
                    decoding={idx===0? 'sync':'async'}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="promos__dots" role="tablist" aria-label="Selector de diapositivas">
            {data.map((_, idx) => (
              <button
                key={idx}
                className={`promos__dot ${i===idx? 'is-active':''}`}
                aria-label={`Ir a la diapositiva ${idx+1}`}
                aria-pressed={i===idx}
                onClick={()=>setI(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
