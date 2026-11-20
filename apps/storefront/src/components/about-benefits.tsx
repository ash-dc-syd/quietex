const benefits = [
  { icon: "home", title: "At home in your space", body: "Bring texture and acoustic comfort to bedrooms, living areas and hallways. Ask us about suitability for areas exposed to moisture or humidity." },
  { icon: "shield", title: "Fire performance, clearly explained", body: "Get the fire-test documentation for your chosen panel and installation, so you can check the requirements for your project." },
  { icon: "leaf", title: "Considered material choices", body: "Explore PET felt, surface patterns and finishes. Ask us about recycled content and material information for the panel you choose." },
  { icon: "sparkle", title: "Material safety", body: "Ask us for VOC, emissions and material-safety information for your chosen panel and finish, to help you make an informed choice for your indoor space." },
] as const
function BenefitIcon({ name }: { name: typeof benefits[number]["icon"] }) {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === "home" ? <><path d="m3 10 9-7 9 7M5 9v12h14V9"/><path d="M9 21v-7h6v7"/></> : name === "shield" ? <><path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></> : name === "leaf" ? <><path d="M20 4c-8-1-15 2-15 9a6 6 0 0 0 6 6c7 0 10-7 9-15Z"/><path d="M4 21 16 9M9 16v-5M9 16h5"/></> : <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/><path d="M20 3v4M18 5h4"/></>}</svg>
}
export function AboutBenefits() {
  return <section className="section-wrap about-benefits" aria-labelledby="about-benefits-title"><div className="about-benefits-heading"><div><p className="eyebrow">Why choose Quietex</p><h2 id="about-benefits-title">Made for <em>everyday spaces.</em></h2></div><p>Find a finish that suits your room, with practical advice on materials, care and installation.</p></div><div className="about-benefits-grid">{benefits.map(benefit => <article key={benefit.icon}><span className="about-benefit-icon"><BenefitIcon name={benefit.icon}/></span><h3>{benefit.title}</h3><p>{benefit.body}</p></article>)}</div></section>
}
