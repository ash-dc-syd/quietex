import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const workerMode = process.env.MEDUSA_WORKER_MODE || "shared"
if (!["shared", "server", "worker"].includes(workerMode)) {
  throw new Error("MEDUSA_WORKER_MODE must be shared, server or worker")
}
if (process.env.NODE_ENV === "production") {
  for (const name of ["DATABASE_URL", "REDIS_URL", "JWT_SECRET", "COOKIE_SECRET"]) {
    if (!process.env[name]) throw new Error(`Missing required environment variable: ${name}`)
  }
}

const redisUrl = process.env.REDIS_URL

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl,
    workerMode: workerMode as "shared" | "server" | "worker",
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  admin: {
    disable: workerMode === "worker",
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  },
  modules: [
    ...(process.env.S3_BUCKET ? [{
      resolve: "@medusajs/medusa/file",
      options: { providers: [{
        resolve: "@medusajs/medusa/file-s3", id: "s3",
        options: {
          file_url: `${(process.env.MEDUSA_BACKEND_URL || "http://localhost:9000").replace(/\/$/, "")}/media`,
          access_key_id: process.env.S3_ACCESS_KEY_ID,
          secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
          bucket: process.env.S3_BUCKET,
          region: process.env.S3_REGION || "auto",
          endpoint: process.env.S3_ENDPOINT,
          acl: false,
        },
      }] },
    }] : []),
    { resolve: "./src/modules/enquiry" },
    ...(process.env.RESEND_API_KEY ? [{
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [{
          resolve: "./src/modules/resend",
          id: "resend",
          options: {
            channels: ["email"],
            api_key: process.env.RESEND_API_KEY,
            from: process.env.RESEND_FROM_EMAIL,
          },
        }],
      },
    }] : []),
    ...(redisUrl ? [
    {
      resolve: "@medusajs/medusa/caching",
      options: {
        providers: [{
          resolve: "@medusajs/caching-redis",
          id: "caching-redis",
          is_default: true,
          options: { redisUrl },
        }],
      },
    },
    { resolve: "@medusajs/medusa/event-bus-redis", options: { redisUrl } },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: { redis: { redisUrl } },
    },
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [{
          resolve: "@medusajs/medusa/locking-redis",
          id: "locking-redis",
          is_default: true,
          options: { redisUrl },
        }],
      },
    },
    ] : []),
  ],
})
