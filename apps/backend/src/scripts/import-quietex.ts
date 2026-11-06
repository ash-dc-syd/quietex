import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createProductsWorkflow,
  createSalesChannelsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import catalogue from "../data/quietex-catalogue.json"

/** Explicit one-time catalogue import. Reruns skip existing handles to preserve admin edits. */
export default async function importQuietex({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productService = container.resolve(Modules.PRODUCT)
  const channelService = container.resolve(Modules.SALES_CHANNEL)
  const keyService = container.resolve(Modules.API_KEY)
  const storeService = container.resolve(Modules.STORE)

  let [channel] = await channelService.listSalesChannels({ name: "Quietex Catalogue" })
  if (!channel) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Quietex Catalogue", description: "Quote-only Quietex website" }] },
    })
    channel = result[0]
  }

  let [key] = await keyService.listApiKeys({ title: "Quietex Storefront", type: "publishable" })
  if (!key) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: { api_keys: [{ title: "Quietex Storefront", type: "publishable", created_by: "" }] },
    })
    key = result[0]
  }
  const { data: keys } = await query.graph({ entity: "api_key", fields: ["id", "sales_channels.id"], filters: { id: key.id } })
  if (!keys[0]?.sales_channels?.some(item => item?.id === channel.id)) {
    await linkSalesChannelsToApiKeyWorkflow(container).run({ input: { id: key.id, add: [channel.id] } })
  }

  const [store] = await storeService.listStores()
  if (store && (await productService.listProducts({}, { take: 1 })).length === 0) {
    await updateStoresWorkflow(container).run({ input: {
      selector: { id: store.id },
      update: { name: "Quietex", default_sales_channel_id: channel.id,
        supported_currencies: [{ currency_code: "aud", is_default: true }] },
    } })
  }

  let imported = 0
  for (const panel of catalogue) {
    const existing = await productService.listProducts({ handle: panel.handle })
    if (existing.length) { logger.info(`Skipped existing panel: ${panel.title}`); continue }
    const material = panel.specifications.find(spec => /^materials?$/i.test(spec.name))?.value || ""
    const size = panel.specifications.find(spec => spec.name === "Size")?.value || ""
    const thickness = panel.specifications.find(spec => spec.name === "Thickness")?.value || ""
    const description = `${panel.title} is an acoustic panel made from ${material.toLowerCase()}. Panel size: ${size}; thickness: ${thickness}. Choose a finish below and enquire about your project.`
    await createProductsWorkflow(container).run({ input: { products: [{
      title: panel.title,
      handle: panel.handle,
      subtitle: "Acoustic wall panel",
      description,
      material,
      status: ProductStatus.PUBLISHED,
      thumbnail: panel.thumbnail,
      images: panel.images.map(url => ({ url })),
      sales_channels: [{ id: channel.id }],
      options: [{ title: "Finish", values: panel.variants.map(variant => variant.finish) }],
      variants: panel.variants.map(variant => ({
        title: variant.finish,
        thumbnail: variant.image,
        options: { Finish: variant.finish },
        manage_inventory: false,
        prices: [],
      })),
      metadata: {
        quietex_catalogue: true,
        quote_only: true,
        specifications: panel.specifications,
        source_url: panel.source,
        source_reviewed: "2026-11-06",
        finish_images: Object.fromEntries(panel.variants.map(variant => [variant.finish, variant.image])),
      },
    }] } })
    imported++
    logger.info(`Imported panel: ${panel.title} (${panel.variants.length} finishes)`)
  }
  logger.info(`Quietex import complete: ${imported} new products; ${catalogue.length - imported} existing products preserved.`)
  // This is a catalogue-scoped publishable key, not an Admin API credential.
  logger.info(`QUIETEX_PUBLISHABLE_KEY=${key.token}`)
}
