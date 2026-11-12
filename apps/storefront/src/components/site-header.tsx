"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { media } from "@/lib/catalogue"
import { Arrow } from "./icons"

export function SiteHeader({ announcement = "Considered design. Better acoustics." }: { announcement?: string }) {
  const [open, setOpen] = useState(false)
  const links = [{ label: "Room preview", href: "/room-preview" },{ label: "Our panels", href: "/#panels" }, { label: "Spaces", href: "/#spaces" }, { label: "About Quietex", href: "/#about" }]
  return <>
    <div className="announcement">{announcement}</div>
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Quietex home" onClick={() => setOpen(false)}><Image unoptimized src={media.logo} width={170} height={30} alt="Quietex" priority /></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(link => <Link href={link.href} key={link.href}>{link.label}</Link>)}</nav>
      <Link href="/contact" className="header-enquiry" onClick={() => setOpen(false)}>Request a Quote <Arrow diagonal /></Link>
      <button className={`menu-toggle ${open ? "is-open" : ""}`} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><span /><span /></button>
      {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{links.map(link => <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}<Arrow /></Link>)}<Link href="/contact" onClick={() => setOpen(false)}>Request a Quote<Arrow diagonal /></Link></nav>}
    </header>
  </>
}
