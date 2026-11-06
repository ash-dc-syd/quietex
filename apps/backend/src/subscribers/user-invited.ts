import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function userInvited({ event: { data }, container }: SubscriberArgs<{ id: string }>) {
  if (!process.env.RESEND_API_KEY) throw new Error("Invite email delivery is not configured")
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: [invite] } = await query.graph({
    entity: "invite", fields: ["email", "token", "accepted"], filters: { id: data.id },
  })
  if (!invite || invite.accepted) return
  const appConfig = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)
  const base = appConfig.admin.backendUrl
  if (!base || base === "/") throw new Error("Public Medusa backend URL is required for invitation emails")
  const url = new URL(`${base.replace(/\/$/, "")}${appConfig.admin.path || "/app"}/invite`)
  url.searchParams.set("token", invite.token)
  await container.resolve(Modules.NOTIFICATION).createNotifications({
    to: invite.email, channel: "email", template: "user-invited", data: { invite_url: url.toString() },
  })
}

export const config: SubscriberConfig = { event: ["invite.created", "invite.resent"] }
