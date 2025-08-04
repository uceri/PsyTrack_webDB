import { Router } from 'express';
import { db } from '../db/index.js';
import { switches, alters } from '../schema.js';
import { eq } from 'drizzle-orm';
const router = Router();
// POST /api/switches - Create a new switch log
router.post('/', async (req, res) => {
    try {
        const { fromAlterId, toAlterId, notes, date, disorderId } = req.body;
        if (!toAlterId || !date) {
            return res.status(400).json({ error: 'Missing required fields: toAlterId and date' });
        }
        // Validate that the alters exist
        const toAlterExists = await db.select().from(alters).where(eq(alters.id, toAlterId));
        if (toAlterExists.length === 0) {
            return res.status(404).json({ error: `toAlterId ${toAlterId} not found.` });
        }
        if (fromAlterId) {
            const fromAlterExists = await db.select().from(alters).where(eq(alters.id, fromAlterId));
            if (fromAlterExists.length === 0) {
                return res.status(404).json({ error: `fromAlterId ${fromAlterId} not found.` });
            }
        }
        const newSwitch = await db.insert(switches).values({
            fromAlterId,
            toAlterId,
            notes,
            date,
            disorderId
        }).returning();
        res.status(201).json(newSwitch[0]);
    }
    catch (error) {
        console.error('Error creating switch:', error);
        res.status(500).json({ error: 'Failed to create switch' });
    }
});
// GET /api/switches - Retrieve all switches
router.get('/', async (req, res) => {
    try {
        const allSwitches = await db.select().from(switches);
        res.status(200).json(allSwitches);
    }
    catch (error) {
        console.error('Error retrieving switches:', error);
        res.status(500).json({ error: 'Failed to retrieve switches' });
    }
});
// DELETE /api/switches/:id - Delete a switch log
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const deletedSwitch = await db.delete(switches).where(eq(switches.id, id)).returning();
        if (deletedSwitch.length === 0) {
            return res.status(404).json({ error: 'Switch log not found' });
        }
        res.status(200).json({ message: `Switch log with ID ${id} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting switch log:', error);
        res.status(500).json({ error: 'Failed to delete switch log' });
    }
});
export default router;
//# sourceMappingURL=switches.js.map