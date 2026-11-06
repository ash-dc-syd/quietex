"use client"
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="main" className="section-wrap"><h1>We couldn’t load the collection.</h1><p>Please try again, or email <a href="mailto:enquiries@quietex.com.au">enquiries@quietex.com.au</a> for help with your project.</p><button className="button button-dark" onClick={reset}>Try again</button></main>
}
