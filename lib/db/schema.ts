import { pgTable, serial, text, timestamp, integer, varchar, pgEnum } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  deletedAt: timestamp('deleted_at'),
  role: text('role'),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripeProductId: text('stripe_product_id'),
  subscriptionStatus: text('subscription_status'),
  updatedAt: timestamp('updated_at'),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  teamId: integer('team_id').references(() => teams.id),
  role: text('role'),
});

export const activityTypeEnum = pgEnum('activity_type', ['SIGN_IN', 'SIGN_UP', 'CREATE_TEAM', 'UPDATE_PASSWORD', 'DELETE_ACCOUNT', 'UPDATE_ACCOUNT', 'REMOVE_TEAM_MEMBER', 'INVITE_T_MEMBER', 'ACCEPT_INVITATION']);

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').references(() => teams.id),
  userId: integer('user_id').references(() => users.id),
  action: activityTypeEnum('action'),
  ipAddress: varchar('ip_address', { length: 255 }),
  timestamp: timestamp('timestamp').defaultNow(),
});

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').references(() => teams.id),
  email: text('email').notNull(),
  role: text('role'),
  status: text('status'),
  invitedBy: integer('invited_by').references(() => users.id),
});

export type NewUser = typeof users.$inferInsert;
export type NewTeam = typeof teams.$inferInsert;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type ActivityType = (typeof activityTypeEnum.enumValues)[number];
