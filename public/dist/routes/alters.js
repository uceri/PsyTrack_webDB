import { Router } from 'express';
import { db } from '../db/index.js';
import { alters, disorders } from '../schema.js'; // Import disorders for validation
import { eq } from 'drizzle-orm';
const router = Router();
// POST /api/alters - Create a new alter
router.post('/', async (req, res) => {
    try {
        const { name, age, role, disorderId } = req.body;
        // Validation
        if (!name || !disorderId) {
            return res.status(400).json({ error: 'Missing required fields: name and disorderId' });
        }
        // Check if the disorderId actually exists
        const disorderExists = await db.select().from(disorders).where(eq(disorders.id, disorderId));
        if (disorderExists.length === 0) {
            return res.status(404).json({ error: `Disorder with ID ${disorderId} not found.` });
        }
        const newAlter = await db.insert(alters).values({
            name,
            age,
            role,
            disorderId,
        }).returning();
        res.status(201).json(newAlter[0]);
    }
    catch (error) {
        console.error('Error creating alter:', error);
        res.status(500).json({ error: 'Failed to create alter' });
    }
});
// GET /api/alters - Retrieve all alters
router.get('/', async (req, res) => {
    try {
        const allAlters = await db.select().from(alters);
        res.status(200).json(allAlters);
    }
    catch (error) {
        console.error('Error retrieving alters:', error);
        res.status(500).json({ error: 'Failed to retrieve alters' });
    }
});
// GET /api/alters/:id - Retrieve a single alter by ID
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const alter = await db.select().from(alters).where(eq(alters.id, id));
        if (alter.length === 0) {
            return res.status(404).json({ error: 'Alter not found' });
        }
        res.status(200).json(alter[0]);
    }
    catch (error) {
        console.error('Error retrieving alter:', error);
        res.status(500).json({ error: 'Failed to retrieve alter' });
    }
});
// PUT /api/alters/:id - Update an alter by ID
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const { name, age, role, disorderId } = req.body;
        const updatedAlter = await db.update(alters).set({
            name,
            age,
            role,
            disorderId,
        }).where(eq(alters.id, id)).returning();
        if (updatedAlter.length === 0) {
            return res.status(404).json({ error: 'Alter not found' });
        }
        res.status(200).json(updatedAlter[0]);
    }
    catch (error) {
        console.error('Error updating alter:', error);
        res.status(500).json({ error: 'Failed to update alter' });
    }
});
// DELETE /api/alters/:id - Delete an alter by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const deletedAlter = await db.delete(alters).where(eq(alters.id, id)).returning();
        if (deletedAlter.length === 0) {
            return res.status(404).json({ error: 'Alter not found' });
        }
        res.status(200).json({ message: `Alter with ID ${id} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting alter:', error);
        res.status(500).json({ error: 'Failed to delete alter' });
    }
});
export default router;
//# sourceMappingURL=alters.js.map