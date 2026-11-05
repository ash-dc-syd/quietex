export function Arrow({ diagonal = false, className = "" }: { diagonal?: boolean; className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export function SoundLines() {
  return <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M5 11v6m6-11v16m6-19v22m6-15v8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
}
