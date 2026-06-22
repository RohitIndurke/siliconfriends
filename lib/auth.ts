import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";

export type UserRole = "student" | "admin";

export const auth = betterAuth({
  /**
   * S-05: Explicitly set baseURL from environment variable.
   * Set BETTER_AUTH_URL to your production domain in production env vars.
   * e.g., BETTER_AUTH_URL=https://your-domain.com
   */
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "student",
      },
    },
  },
});
