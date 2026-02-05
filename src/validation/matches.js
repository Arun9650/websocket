import { z } from 'zod';

// Constant: MATCH_STATUS with lowercase values
export const MATCH_STATUS = Object.freeze({
	SCHEDULED: 'scheduled',
	LIVE: 'live',
	FINISHED: 'finished',
});

// Helper: validate strict ISO date string (toISOString format)
const isIsoDateString = (val) => {
	if (typeof val !== 'string') return false;
	const d = new Date(val);
	return !Number.isNaN(d.getTime()) && d.toISOString() === val;
};

// Query schema: optional limit as coerced positive int, max 100
export const listMatchesQuerySchema = z.object({
	limit: z.coerce.number().int().positive().max(100).optional(),
});

// Params schema: required id as coerced positive int
export const matchIdParamSchema = z.object({
	id: z.coerce.number().int().positive(),
});

// Create match schema
export const createMatchSchema = z
	.object({
		sport: z.string().min(1, 'sport is required'),
		homeTeam: z.string().min(1, 'homeTeam is required'),
		awayTeam: z.string().min(1, 'awayTeam is required'),
		startTime: z.string().refine(isIsoDateString, {
			message: 'startTime must be a valid ISO date string',
		}),
		endTime: z.string().refine(isIsoDateString, {
			message: 'endTime must be a valid ISO date string',
		}),
		homeScore: z.coerce.number().int().min(0).optional(),
		awayScore: z.coerce.number().int().min(0).optional(),
	})
	.superRefine((data, ctx) => {
		const start = new Date(data.startTime).getTime();
		const end = new Date(data.endTime).getTime();
		if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['endTime'],
				message: 'endTime must be after startTime',
			});
		}
	});

// Update score schema: both required as coerced non-negative ints
export const updateScoreSchema = z.object({
	homeScore: z.coerce.number().int().min(0),
	awayScore: z.coerce.number().int().min(0),
});
