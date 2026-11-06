import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import ResendNotificationProvider from "./service"

export default ModuleProvider(Modules.NOTIFICATION, {
  services: [ResendNotificationProvider],
})
