import { relations, sql } from 'drizzle-orm'
import { boolean, doublePrecision, foreignKey, integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const AppointmentStatus = pgEnum('AppointmentStatus', ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])

export const Appointment = pgTable('Appointment', {
	id: text('id').notNull().primaryKey().default(sql`uuid(4)`),
	scheduled_time: timestamp('scheduled_time', { precision: 3 }).notNull(),
	duration: integer('duration').notNull(),
	clientEmail: text('clientEmail'),
	status: AppointmentStatus('status').notNull().default("PENDING"),
	serviceId: text('serviceId').notNull(),
	staffId: text('staffId').notNull(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
}, (Appointment) => ({
	'Appointment_service_fkey': foreignKey({
		name: 'Appointment_service_fkey',
		columns: [Appointment.serviceId],
		foreignColumns: [Service.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'Appointment_staff_fkey': foreignKey({
		name: 'Appointment_staff_fkey',
		columns: [Appointment.staffId],
		foreignColumns: [Staff.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const Service = pgTable('Service', {
	id: text('id').notNull().primaryKey().default(sql`uuid(4)`),
	name: text('name').notNull(),
	description: text('description'),
	duration_minutes: integer('duration_minutes').notNull(),
	price_cents: doublePrecision('price_cents').notNull(),
	category: text('category'),
	is_active: boolean('is_active').notNull().default(true),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
});

export const Staff = pgTable('Staff', {
	id: text('id').notNull().primaryKey().default(sql`uuid(4)`),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
});

export const Client = pgTable('Client', {
	id: text('id').notNull().primaryKey().default(sql`uuid(4)`),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	phone: text('phone'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
});

export const Settings = pgTable('Settings', {
	id: text('id').notNull().primaryKey().default(sql`uuid(4)`),
	key: text('key').notNull().unique(),
	value: text('value').notNull(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
});

export const User = pgTable('User', {
	id: serial('id').notNull().primaryKey(),
	name: text('name'),
	email: text('email').notNull().unique(),
	passwordHash: text('passwordHash').notNull(),
	role: text('role').notNull().default("member"),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull(),
	deletedAt: timestamp('deletedAt', { precision: 3 })
});

export const Team = pgTable('Team', {
	id: serial('id').notNull().primaryKey(),
	name: text('name').notNull(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
});

export const TeamMember = pgTable('TeamMember', {
	id: serial('id').notNull().primaryKey(),
	userId: integer('userId').notNull(),
	teamId: integer('teamId').notNull(),
	role: text('role').notNull(),
	joinedAt: timestamp('joinedAt', { precision: 3 }).notNull().defaultNow()
}, (TeamMember) => ({
	'TeamMember_user_fkey': foreignKey({
		name: 'TeamMember_user_fkey',
		columns: [TeamMember.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'TeamMember_team_fkey': foreignKey({
		name: 'TeamMember_team_fkey',
		columns: [TeamMember.teamId],
		foreignColumns: [Team.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const ActivityLog = pgTable('ActivityLog', {
	id: serial('id').notNull().primaryKey(),
	teamId: integer('teamId').notNull(),
	userId: integer('userId'),
	action: text('action').notNull(),
	timestamp: timestamp('timestamp', { precision: 3 }).notNull().defaultNow(),
	ipAddress: text('ipAddress')
}, (ActivityLog) => ({
	'ActivityLog_team_fkey': foreignKey({
		name: 'ActivityLog_team_fkey',
		columns: [ActivityLog.teamId],
		foreignColumns: [Team.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'ActivityLog_user_fkey': foreignKey({
		name: 'ActivityLog_user_fkey',
		columns: [ActivityLog.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const Invitation = pgTable('Invitation', {
	id: serial('id').notNull().primaryKey(),
	teamId: integer('teamId').notNull(),
	email: text('email').notNull(),
	role: text('role').notNull(),
	invitedBy: integer('invitedBy').notNull(),
	invitedAt: timestamp('invitedAt', { precision: 3 }).notNull().defaultNow(),
	status: text('status').notNull().default("pending")
}, (Invitation) => ({
	'Invitation_team_fkey': foreignKey({
		name: 'Invitation_team_fkey',
		columns: [Invitation.teamId],
		foreignColumns: [Team.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'Invitation_invitedByUser_fkey': foreignKey({
		name: 'Invitation_invitedByUser_fkey',
		columns: [Invitation.invitedBy],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const AppointmentRelations = relations(Appointment, ({ one }) => ({
	service: one(Service, {
		relationName: 'AppointmentToService',
		fields: [Appointment.serviceId],
		references: [Service.id]
	}),
	staff: one(Staff, {
		relationName: 'AppointmentToStaff',
		fields: [Appointment.staffId],
		references: [Staff.id]
	})
}));

export const ServiceRelations = relations(Service, ({ many }) => ({
	appointments: many(Appointment, {
		relationName: 'AppointmentToService'
	})
}));

export const StaffRelations = relations(Staff, ({ many }) => ({
	appointments: many(Appointment, {
		relationName: 'AppointmentToStaff'
	})
}));

export const UserRelations = relations(User, ({ many }) => ({
	teamMembers: many(TeamMember, {
		relationName: 'TeamMemberToUser'
	}),
	invitationsSent: many(Invitation, {
		relationName: 'sent_invitations'
	}),
	activityLogs: many(ActivityLog, {
		relationName: 'ActivityLogToUser'
	})
}));

export const TeamRelations = relations(Team, ({ many }) => ({
	teamMembers: many(TeamMember, {
		relationName: 'TeamToTeamMember'
	}),
	activityLogs: many(ActivityLog, {
		relationName: 'ActivityLogToTeam'
	}),
	invitations: many(Invitation, {
		relationName: 'InvitationToTeam'
	})
}));

export const TeamMemberRelations = relations(TeamMember, ({ one }) => ({
	user: one(User, {
		relationName: 'TeamMemberToUser',
		fields: [TeamMember.userId],
		references: [User.id]
	}),
	team: one(Team, {
		relationName: 'TeamToTeamMember',
		fields: [TeamMember.teamId],
		references: [Team.id]
	})
}));

export const ActivityLogRelations = relations(ActivityLog, ({ one }) => ({
	team: one(Team, {
		relationName: 'ActivityLogToTeam',
		fields: [ActivityLog.teamId],
		references: [Team.id]
	}),
	user: one(User, {
		relationName: 'ActivityLogToUser',
		fields: [ActivityLog.userId],
		references: [User.id]
	})
}));

export const InvitationRelations = relations(Invitation, ({ one }) => ({
	team: one(Team, {
		relationName: 'InvitationToTeam',
		fields: [Invitation.teamId],
		references: [Team.id]
	}),
	invitedByUser: one(User, {
		relationName: 'sent_invitations',
		fields: [Invitation.invitedBy],
		references: [User.id]
	})
}));