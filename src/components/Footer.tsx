import Link from "next/link"

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer" aria-label="Pie de página">
      <div className="container footer__inner">
        <div className="footer__grid">
          <section className="footer__brand" aria-label="Marca">
            <Link href="/" className="footer__logo">
              <img src="/logo-disiento.svg" alt="disiento" />
            </Link>
            <p className="footer__tag">hecho con atencion al detalle y mucho amor</p>
          </section>

          <nav className="footer__nav" aria-label="Explorar">
            <strong className="footer__title">Explorar</strong>
            <Link href="/c/carboncillo" className="footer__link">Carboncillo</Link>
            <Link href="/c/oleo-pastel" className="footer__link">Óleo pastel</Link>
            <Link href="/ropa-accesorios" className="footer__link">Ropa y accesorios</Link>
            <Link href="/hogar" className="footer__link">Hogar</Link>
          </nav>

          <section className="footer__contact" aria-label="Contacto">
            <strong className="footer__title">Contacto</strong>
            <a href="mailto:contacto@disiento.com" className="footer__link">contacto@disiento.com</a>
            <a href="tel:+573016271439" className="footer__link">+57 301 627 1439</a>
            <div className="footer__social" aria-label="Redes">
              <a
                className="social"
                href="https://www.instagram.com/disiento_oficial/?utm_source=qr&igsh=NWh3ZHQ3NWR1NDN1"
                aria-label="Instagram"
                title="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-2a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
                </svg>
              </a>
              <a
                className="social"
                href="https://www.facebook.com/share/17FPDEDyHQ/"
                aria-label="Facebook"
                title="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12"/>
                </svg>
              </a>
            </div>
          </section>
        </div>

        <div className="footer__bar">
          <small>© {year} disiento. Todos los derechos reservados.</small>
          <div className="footer__legal">
            <Link href="#" className="footer__link">Términos</Link>
            <span aria-hidden>·</span>
            <Link href="#" className="footer__link">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
