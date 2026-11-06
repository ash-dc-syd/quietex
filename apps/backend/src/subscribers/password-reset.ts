import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function passwordReset({ event: { data }, container }: SubscriberArgs<{
  entity_id: string; token: string; actor_type: string
}>) {
  // This quote-only site has no customer accounts/reset page.
  if (data.actor_type !== "user") return
  if (!process.env.RESEND_API_KEY) throw new Error("Password reset email delivery is not configured")
  const appConfig = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)
  const base = appConfig.admin.backendUrl
  if (!base || base === "/") throw new Error("Public Medusa backend URL is required for password reset emails")
  const url = new URL(`${base.replace(/\/$/, "")}${appConfig.admin.path || "/app"}/reset-password`)
  url.searchParams.set("token", data.token)
  url.searchParams.set("email", data.entity_id)
  await container.resolve(Modules.NOTIFICATION).createNotifications({
    to: data.entity_id, channel: "email", template: "password-reset", data: { reset_url: url.toString() },
  })
}

export const config: SubscriberConfig = { event: "auth.password_reset" }
