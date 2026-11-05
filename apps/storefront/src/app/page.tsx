export default function Home() {
  return (
    <>
      <header className="site-header">
        <a href="/" className="wordmark" aria-label="Quietex home">quietex</a>
        <a className="text-link" href="mailto:enquiries@quietex.com.au">Get in touch <span aria-hidden="true">↗</span></a>
      </header>
      <main id="main">
        <section className="intro" aria-labelledby="intro-title">
          <p className="eyebrow">Acoustic panels for considered spaces</p>
          <h1 id="intro-title">Spaces that sound<br />as good as they look.</h1>
          <p className="intro-copy">Discover acoustic panels for home theatres, workplaces and everyday interiors. Tell us about your space and we’ll help you explore the range.</p>
          <a className="button" href="mailto:enquiries@quietex.com.au?subject=Quietex%20project%20enquiry">Request a Quote <span aria-hidden="true">↗</span></a>
        </section>
        <section className="retailers" aria-labelledby="retailer-title">
          <div>
            <p className="eyebrow">Where to buy</p>
            <h2 id="retailer-title">Find Quietex at our retailers.</h2>
            <p>Contact a retailer for product availability and purchasing.</p>
          </div>
          <ul>
            <li><a href="https://www.digitalcinema.com.au/">Digital Cinema <span aria-hidden="true">↗</span></a></li>
            <li><a href="https://www.audiojunction.com.au/">Audio Junction <span aria-hidden="true">↗</span></a></li>
            <li><a href="https://www.instylehifi.com.au/">Instyle HiFi <span aria-hidden="true">↗</span></a></li>
          </ul>
        </section>
      </main>
      <footer>Quietex <span>Acoustic panels. Thoughtful spaces.</span></footer>
    </>
  )
}
