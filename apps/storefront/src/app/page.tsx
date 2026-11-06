import HomeView from "@/components/home-view"
import { getPanels } from "@/lib/products"
import { medusaFetch } from "@/lib/medusa"
import { defaultContent, type SiteDocument } from "@/lib/site-content"
export const dynamic = "force-dynamic"
export default async function Home() {
 const [panels,result] = await Promise.all([getPanels(),medusaFetch<{content:SiteDocument}>("/store/site-content").catch(()=>({content:defaultContent}))])
 return <HomeView panels={panels} content={result.content}/>
}
