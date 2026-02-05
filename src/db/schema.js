import {
	integer,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	smallint,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';

// Enum: match_status
export const matchStatus = pgEnum('match_status', [
	'scheduled',
	'live',
	'finished',
]);

// Table: matches
export const matches = pgTable('matches', {
	id: serial('id').primaryKey(),
	sport: varchar('sport', { length: 50 }).notNull(),
	homeTeam: varchar('home_team', { length: 100 }).notNull(),
	awayTeam: varchar('away_team', { length: 100 }).notNull(),
	status: matchStatus('status').notNull(),
	startTime: timestamp('start_time', { withTimezone: true }).notNull(),
	endTime: timestamp('end_time', { withTimezone: true }),
	homeScore: integer('home_score').notNull().default(0),
	awayScore: integer('away_score').notNull().default(0),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
});

// Table: commentary
export const commentary = pgTable('commentary', {
	id: serial('id').primaryKey(),
	matchId: integer('match_id')
		.notNull()
		.references(() => matches.id, { onDelete: 'cascade' }),
	minute: smallint('minute'),
	sequence: integer('sequence'),
	period: varchar('period', { length: 20 }),
	eventType: varchar('event_type', { length: 50 }),
	actor: varchar('actor', { length: 100 }),
	team: varchar('team', { length: 100 }),
	message: text('message'),
	metadata: jsonb('metadata'),
	tags: text('tags').array(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
});
