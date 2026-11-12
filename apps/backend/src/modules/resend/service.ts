import { createHash } from "node:crypto"
import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import type { ProviderSendNotificationDTO, ProviderSendNotificationResultsDTO } from "@medusajs/framework/types"

import { readRoomPhoto, type RoomPhoto } from "../../lib/room-photos"

type Options = { api_key: string; from: string }

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]!)
}

export function renderEmail(template: string, data: Record<string, unknown>) {
  if (template === "enquiry-received") {
    const fields = [["Name",data.name],["Email",data.email],["Phone",data.phone],["Postcode",data.postcode],["Panel",data.product],["Finish",data.finish],["Quantity",data.quantity],["Subject",data.subject],["Message",data.message],["Reference",data.id]]
    const room=data.kind==="room_preview"
    const text = (room?"Room preview request. Room photos are attached. Create the preview manually in ChatGPT and reply to the customer.\n\n":"")+fields.map(([label,value])=>`${label}: ${value ?? ""}`).join("\n\n")
    return {subject:room?"New Quietex room preview request (photos attached)":"New Quietex website enquiry",text,
      html:`<html><body style="font-family:Arial,sans-serif;line-height:1.6;max-width:640px;margin:24px auto"><h1 style="font-size:24px">${room?"Room preview request":"New Quietex enquiry"}</h1>${room?"<p>Room photos are attached. Create the preview manually in ChatGPT, review it, and reply to the customer.</p>":""}${fields.map(([label,value])=>`<p><strong>${label}</strong><br><span style="white-space:pre-wrap">${escapeHtml(String(value ?? ""))}</span></p>`).join("")}<p>Manage this enquiry in Medusa → Enquiries.</p></body></html>`}
  }
  const invite = template === "user-invited"
  if (!invite && template !== "password-reset") throw new Error("Unsupported Quietex email template")
  const url = data[invite ? "invite_url" : "reset_url"]
  if (typeof url !== "string" || !/^https?:\/\//.test(url)) throw new Error("Missing email action URL")
  const subject = invite ? "You're invited to Quietex Admin" : "Reset your Quietex Admin password"
  const message = invite
    ? "You've been invited to manage the Quietex catalogue. Use the link below to set up your account."
    : "We received a request to reset your Quietex Admin password. Use the link below to choose a new password."
  const action = invite ? "Accept invitation" : "Reset password"
  const note = invite
    ? "If this invitation was unexpected, you can ignore this email."
    : "If you didn't request this, you can ignore this email. Your password will stay the same."
  return {
    subject,
    text: `${subject}\n\n${message}\n\n${action}: ${url}\n\n${note}`,
    html: `<html><body style="font-family:Arial,sans-serif;color:#202623;line-height:1.6"><main style="max-width:560px;margin:32px auto;padding:24px"><p style="font-size:24px;font-weight:bold">Quietex</p><h1 style="font-size:22px">${subject}</h1><p>${message}</p><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#263b32;color:#fff;padding:12px 20px;text-decoration:none;border-radius:4px">${action}</a></p><p>${note}</p><p style="font-size:12px;color:#666">If the button doesn't work, copy this link into your browser:<br>${escapeHtml(url)}</p></main></body></html>`,
  }
}

export default class ResendNotificationProvider extends AbstractNotificationProviderService {
  static identifier = "quietex-resend"
  private options: Options

  static validateOptions(options: Record<string, unknown>) {
    if (!options.api_key || !options.from) throw new Error("Resend requires api_key and from")
  }

  constructor(_container: unknown, options: Options) {
    super()
    this.options = options
  }

  async send(notification: ProviderSendNotificationDTO): Promise<ProviderSendNotificationResultsDTO> {
    const content = renderEmail(notification.template, notification.data || {})
    const replyTo = notification.template === "enquiry-received" ? notification.data?.email : null
    const attachments = notification.template==="enquiry-received"&&notification.data?.kind==="room_preview"
      ? await Promise.all(((notification.data.room_photos as {files?:RoomPhoto[]}|undefined)?.files||[]).map(async photo=>({filename:photo.filename,content:(await readRoomPhoto(photo)).toString("base64"),content_type:photo.mime}))) : []
    const body = { ...(attachments.length?{attachments}:{}), from: this.options.from, to: [notification.to], ...content,
      ...(typeof replyTo === "string" && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(replyTo) ? {reply_to:replyTo} : {}) }

    // Retries of the same token/email must not send duplicate messages.
    const key = createHash("sha256").update(JSON.stringify(body)).digest("hex")
    let response: Response
    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.options.api_key}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `quietex-${key}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      })
    } catch {
      throw new Error("Resend email request failed; retry delivery")
    }
    // Never log response bodies: they may contain recipient or token data.
    if (!response.ok) throw new Error(`Resend email delivery rejected (HTTP ${response.status})`)
    const result = await response.json() as { id?: string }
    if (!result.id) throw new Error("Resend returned no email ID")
    return { id: result.id }
  }
}
