import { getPanels } from "@/lib/products"
import { defaultContent } from "@/lib/site-content"
import Preview from "./preview"
export const dynamic = "force-dynamic"
export const metadata = { title: "Quietex editor preview", robots: { index: false, follow: false } }
export default async function EditorPreview() {
 const panels=await getPanels()
 const origin=new URL(process.env.MEDUSA_BACKEND_URL||"http://localhost:9000").origin
 return <Preview panels={panels} initial={defaultContent} editorOrigin={origin}/>
}
