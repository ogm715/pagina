"use client"

export default function Hero(){
  return (
    <section className="container hero" aria-label="Bienvenida">
      <h1 className="hero-title welcome">
        <span className="welcome-text">Bienvenido a disiento</span>
      </h1>
      <p className="hero-text">Arte, moda y hogar reunidos en un solo espacio. Cada detalle pensado para marcar diferencia y dejar atrás lo convencional.</p>
      <div className="promo">
        <span className="promo__dot" aria-hidden />
        hecho con atencion al detalle y mucho amor · Envío nacional · Pago seguro
      </div>
    </section>
  )
}
