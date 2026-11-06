import HomeView from "@/components/home-view"
import { getPanels } from "@/lib/products"
export const dynamic = "force-dynamic"
export default async function Home() {
  const panels = await getPanels()
  const handles = ["stella", "margot", "normandy", "adele"]
  const featured = handles.flatMap(handle => panels.filter(p => p.handle === handle))
  return <HomeView panels={featured.length ? featured : panels.slice(0,4)} />
}
