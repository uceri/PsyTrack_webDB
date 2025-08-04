import { Router } from 'express';
import { db } from '../db/index.js';
import { disorders } from '../schema.js';
import { eq } from 'drizzle-orm';
const router = Router();
// POST /api/disorders - Create a new disorder
router.post('/', async (req, res) => {
    try {
        const { name, acronym, fullName } = req.body;
        if (!name || !acronym || !fullName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newDisorder = await db.insert(disorders).values({
            name,
            acronym,
            fullName,
        }).returning();
        res.status(201).json(newDisorder[0]);
    }
    catch (error) {
        console.error('Error creating disorder:', error);
        res.status(500).json({ error: 'Failed to create disorder' });
    }
});
// GET /api/disorders - Retrieve all disorders
router.get('/', async (req, res) => {
    try {
        const allDisorders = await db.select().from(disorders);
        res.status(200).json(allDisorders);
    }
    catch (error) {
        console.error('Error retrieving disorders:', error);
        res.status(500).json({ error: 'Failed to retrieve disorders' });
    }
});
// GET /api/disorders/:id - Retrieve a single disorder by ID
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const disorder = await db.select().from(disorders).where(eq(disorders.id, id));
        if (disorder.length === 0) {
            return res.status(404).json({ error: 'Disorder not found' });
        }
        res.status(200).json(disorder[0]);
    }
    catch (error) {
        console.error('Error retrieving disorder:', error);
        res.status(500).json({ error: 'Failed to retrieve disorder' });
    }
});
// PUT /api/disorders/:id - Update a disorder by ID
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const { name, acronym, fullName } = req.body;
        if (!name && !acronym && !fullName) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        const updatedDisorder = await db.update(disorders).set({
            name,
            acronym,
            fullName,
        }).where(eq(disorders.id, id)).returning();
        if (updatedDisorder.length === 0) {
            return res.status(404).json({ error: 'Disorder not found' });
        }
        res.status(200).json(updatedDisorder[0]);
    }
    catch (error) {
        console.error('Error updating disorder:', error);
        res.status(500).json({ error: 'Failed to update disorder' });
    }
});
// DELETE /api/disorders/:id - Delete a disorder by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const deletedDisorder = await db.delete(disorders).where(eq(disorders.id, id)).returning();
        if (deletedDisorder.length === 0) {
            return res.status(404).json({ error: 'Disorder not found' });
        }
        res.status(200).json({ message: `Disorder with ID ${id} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting disorder:', error);
        res.status(500).json({ error: 'Failed to delete disorder' });
    }
});
export default router;
//# sourceMappingURL=disorders.js.map