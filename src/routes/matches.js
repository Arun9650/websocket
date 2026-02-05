import {Router} from 'express';
import { createMatchSchema, listMatchesQuerySchema } from '../validation/matches.js';
import {db} from '../db/db.js';
import { matches } from '../db/schema.js';
import { getMatchStatus } from '../utils/match-status.js';
import { desc } from 'drizzle-orm';

export const matchRouter = Router();

const MAX_LIMIT = 100;


matchRouter.get('/', async (req, res) => {

    const parsed = listMatchesQuerySchema.safeParse(req.query);
    if(!parsed.success){
        return res.status(400).json({ errors: 'invalid query parameters.', details: parsed.error.errors });
    }

    const limit = Math.min(parsed.data.limit ??  50, MAX_LIMIT);

    try {

        const data = await db.select().from(matches).orderBy((desc(matches.createdAt))).limit(limit);

        res.status(200).json({ data });
        
    } catch (error) {
        console.log("🚀 ~ error:", error)
        res.status(500).json({ error: 'Failed to fetch matches.',  details: JSON.stringify(error) }); 
    }


});


matchRouter.post('/', async(req, res) => {

    const parse = createMatchSchema.safeParse(req.body);

    const {data: {startTime, endTime, homeScore, awayScore}} = parse;

    if(!parse.success){
        return  res.status(400).json({ errors: 'invalid payload.', details: parse.error.errors });
    }


    try {
        const [event] = await db.insert(matches).values({
            ...parse.data,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: getMatchStatus(startTime, endTime),
        }).returning();

        res.status(201).json({ message: 'Match created successfully.', data: event });

    } catch (error) {
        console.log("🚀 ~ error:", error)
        res.status(500).json({ error: 'Failed to create match.',  details: JSON.stringify(error) });
    }
});