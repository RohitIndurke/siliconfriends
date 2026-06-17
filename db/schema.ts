import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
					id: text("id").primaryKey(),
					name: text("name").notNull(),
					email: text("email").notNull().unique(),
					emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
					image: text("image"),
					createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
					updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
     role: text("role").notNull().default("student")
});

export const session = sqliteTable("session", {
					id: text("id").primaryKey(),
					expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
					token: text("token").notNull().unique(),
					createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
					updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
					ipAddress: text("ipAddress"),
					userAgent: text("userAgent"),
					userId: text("userId").notNull().references(() => user.id)
});

export const account = sqliteTable("account", {
					id: text("id").primaryKey(),
					accountId: text("accountId").notNull(),
					providerId: text("providerId").notNull(),
					userId: text("userId").notNull().references(() => user.id),
					accessToken: text("accessToken"),
					refreshToken: text("refreshToken"),
					idToken: text("idToken"),
					accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
					refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
					scope: text("scope"),
					password: text("password"),
					createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
					updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const verification = sqliteTable("verification", {
					id: text("id").primaryKey(),
					identifier: text("identifier").notNull(),
					value: text("value").notNull(),
					expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
					createdAt: integer("createdAt", { mode: "timestamp" }),
					updatedAt: integer("updatedAt", { mode: "timestamp" })
});

export const job = sqliteTable("job", {
  id: text("id").primaryKey(),
  jobTitle: text("jobTitle").notNull(),
  employmentType: text("employmentType").notNull(),
  positionType: text("positionType").notNull(),
  location: text("location").notNull(),
  duration: text("duration").notNull(),
  jobFunction: text("jobFunction").notNull(),
  
  companyName: text("companyName").notNull(),
  companyLogo: text("companyLogo").notNull(),
  industry: text("industry").notNull(),
  foundedYear: integer("foundedYear"),
  website: text("website").notNull(),
  contactPerson: text("contactPerson").notNull(),
  organizationSize: text("organizationSize").notNull(),
  baseLocation: text("baseLocation").notNull(),

  stipendMonthly: integer("stipendMonthly"),
  maxIncentivesMonthly: integer("maxIncentivesMonthly"),
  eligibleForFte: integer("eligibleForFte", { mode: "boolean" }).notNull(),
  ctcFixedLpa: real("ctcFixedLpa"),
  ctcVariableLpa: real("ctcVariableLpa"),

  requiredSkills: text("requiredSkills").notNull(),
  goodToHaveSkills: text("goodToHaveSkills").notNull(),

  description: text("description").notNull(),
  otherDetails: text("otherDetails"),

  eligibilitySummary: text("eligibilitySummary").notNull(),
  eligibleCourses: text("eligibleCourses", { mode: "json" }).$type<string[]>().notNull(),
  selectionProcess: text("selectionProcess").notNull(),

  status: text("status").notNull(),
  onCampus: integer("onCampus", { mode: "boolean" }).notNull(),
  opensAt: text("opensAt").notNull(),
  closesAt: text("closesAt").notNull(),
  externalApplyLink: text("externalApplyLink").notNull(),

  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  createdBy: text("createdBy").notNull().references(() => user.id)
});
