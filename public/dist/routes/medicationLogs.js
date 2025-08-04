import { Router } from 'express';
import { db } from '../db/index.js';
import { medicationLogs, medications } from '../schema.js';
import { eq } from 'drizzle-orm';
const router = Router();
// POST /api/medication-logs - Create a new log
router.post('/', async (req, res) => {
    try {
        const { medicationId, date, doseTaken, notes } = req.body;
        if (!medicationId || !date) {
            return res.status(400).json({ error: 'Missing required fields: medicationId and date' });
        }
        const medExists = await db.select().from(medications).where(eq(medications.id, medicationId));
        if (medExists.length === 0) {
            return res.status(404).json({ error: `Medication with ID ${medicationId} not found.` });
        }
        const newLog = await db.insert(medicationLogs).values({
            medicationId,
            date,
            doseTaken,
            notes
        }).returning();
        res.status(201).json(newLog[0]);
    }
    catch (error) {
        console.error('Error creating medication log:', error);
        res.status(500).json({ error: 'Failed to create medication log' });
    }
});
// GET /api/medication-logs - Retrieve all logs
router.get('/', async (req, res) => {
    try {
        const allLogs = await db.select().from(medicationLogs);
        res.status(200).json(allLogs);
    }
    catch (error) {
        console.error('Error retrieving medication logs:', error);
        res.status(500).json({ error: 'Failed to retrieve medication logs' });
    }
});
// GET /api/medication-logs/:id - Retrieve a single log by ID
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const log = await db.select().from(medicationLogs).where(eq(medicationLogs.id, id));
        if (log.length === 0) {
            return res.status(404).json({ error: 'Log not found' });
        }
        res.status(200).json(log[0]);
    }
    catch (error) {
        console.error('Error retrieving medication log:', error);
        res.status(500).json({ error: 'Failed to retrieve medication log' });
    }
});
// PUT /api/medication-logs/:id - Update a log by ID
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const { medicationId, date, doseTaken, notes } = req.body;
        const updatedLog = await db.update(medicationLogs).set({
            medicationId,
            date,
            doseTaken,
            notes,
        }).where(eq(medicationLogs.id, id)).returning();
        if (updatedLog.length === 0) {
            return res.status(404).json({ error: 'Log not found' });
        }
        res.status(200).json(updatedLog[0]);
    }
    catch (error) {
        console.error('Error updating medication log:', error);
        res.status(500).json({ error: 'Failed to update medication log' });
    }
});
// DELETE /api/medication-logs/:id - Delete a log by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const deletedLog = await db.delete(medicationLogs).where(eq(medicationLogs.id, id)).returning();
        if (deletedLog.length === 0) {
            return res.status(404).json({ error: 'Log not found' });
        }
        res.status(200).json({ message: `Log with ID ${id} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting medication log:', error);
        res.status(500).json({ error: 'Failed to delete medication log' });
    }
});
export default router;
//# sourceMappingURL=medicationLogs.js.map