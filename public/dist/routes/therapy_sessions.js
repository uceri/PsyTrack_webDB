import { Router } from 'express';
import { db } from '../db/index.js';
import { therapySessions, disorders } from '../schema.js';
import { eq } from 'drizzle-orm';
const router = Router();
// POST /api/therapy-sessions - Create a new session log
router.post('/', async (req, res) => {
    try {
        const { date, therapistName, notes, disorderId } = req.body;
        if (!date || !therapistName || !disorderId) {
            return res.status(400).json({ error: 'Missing required fields: date, therapistName, and disorderId' });
        }
        const disorderExists = await db.select().from(disorders).where(eq(disorders.id, disorderId));
        if (disorderExists.length === 0) {
            return res.status(404).json({ error: `Disorder with ID ${disorderId} not found.` });
        }
        const newSession = await db.insert(therapySessions).values({
            date,
            therapistName,
            notes,
            disorderId
        }).returning();
        res.status(201).json(newSession[0]);
    }
    catch (error) {
        console.error('Error creating therapy session:', error);
        res.status(500).json({ error: 'Failed to create therapy session' });
    }
});
// GET /api/therapy-sessions - Retrieve all sessions
router.get('/', async (req, res) => {
    try {
        const allSessions = await db.select().from(therapySessions);
        res.status(200).json(allSessions);
    }
    catch (error) {
        console.error('Error retrieving therapy sessions:', error);
        res.status(500).json({ error: 'Failed to retrieve therapy sessions' });
    }
});
// GET /api/therapy-sessions/:id - Retrieve a single session
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const session = await db.select().from(therapySessions).where(eq(therapySessions.id, id));
        if (session.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.status(200).json(session[0]);
    }
    catch (error) {
        console.error('Error retrieving therapy session:', error);
        res.status(500).json({ error: 'Failed to retrieve therapy session' });
    }
});
// PUT /api/therapy-sessions/:id - Update a session
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const { date, therapistName, notes, disorderId } = req.body;
        const updatedSession = await db.update(therapySessions).set({
            date,
            therapistName,
            notes,
            disorderId,
        }).where(eq(therapySessions.id, id)).returning();
        if (updatedSession.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.status(200).json(updatedSession[0]);
    }
    catch (error) {
        console.error('Error updating therapy session:', error);
        res.status(500).json({ error: 'Failed to update therapy session' });
    }
});
// DELETE /api/therapy-sessions/:id - Delete a session
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const deletedSession = await db.delete(therapySessions).where(eq(therapySessions.id, id)).returning();
        if (deletedSession.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.status(200).json({ message: `Session with ID ${id} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting therapy session:', error);
        res.status(500).json({ error: 'Failed to delete therapy session' });
    }
});
export default router;
//# sourceMappingURL=therapy_sessions.js.map