import { Router } from 'express';
import { db } from '../db/index.js';
import { symptoms, disorders } from '../schema.js';
import { eq } from 'drizzle-orm';
const router = Router();
// POST /api/symptoms - Create a new symptom
router.post('/', async (req, res) => {
    try {
        const { name, severity, notes, disorderId } = req.body;
        if (!name || !disorderId) {
            return res.status(400).json({ error: 'Missing required fields: name and disorderId' });
        }
        const disorderExists = await db.select().from(disorders).where(eq(disorders.id, disorderId));
        if (disorderExists.length === 0) {
            return res.status(404).json({ error: `Disorder with ID ${disorderId} not found.` });
        }
        const newSymptom = await db.insert(symptoms).values({
            name,
            severity,
            notes,
            disorderId
        }).returning();
        res.status(201).json(newSymptom[0]);
    }
    catch (error) {
        console.error('Error creating symptom:', error);
        res.status(500).json({ error: 'Failed to create symptom' });
    }
});
// GET /api/symptoms - Retrieve all symptoms
router.get('/', async (req, res) => {
    try {
        const allSymptoms = await db.select().from(symptoms);
        res.status(200).json(allSymptoms);
    }
    catch (error) {
        console.error('Error retrieving symptoms:', error);
        res.status(500).json({ error: 'Failed to retrieve symptoms' });
    }
});
// GET /api/symptoms/:id - Retrieve a single symptom by ID
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const symptom = await db.select().from(symptoms).where(eq(symptoms.id, id));
        if (symptom.length === 0) {
            return res.status(404).json({ error: 'Symptom not found' });
        }
        res.status(200).json(symptom[0]);
    }
    catch (error) {
        console.error('Error retrieving symptom:', error);
        res.status(500).json({ error: 'Failed to retrieve symptom' });
    }
});
// GET /api/symptoms/disorder/:disorderId - Retrieve all symptoms for a specific disorder
router.get('/disorder/:disorderId', async (req, res) => {
    try {
        const disorderId = parseInt(req.params.disorderId);
        if (isNaN(disorderId)) {
            return res.status(400).json({ error: 'Invalid Disorder ID' });
        }
        const disorderSymptoms = await db.select().from(symptoms).where(eq(symptoms.disorderId, disorderId));
        // It's okay if this is empty, it just means no symptoms are logged yet
        res.status(200).json(disorderSymptoms);
    }
    catch (error) {
        console.error('Error retrieving symptoms for disorder:', error);
        res.status(500).json({ error: 'Failed to retrieve symptoms for disorder' });
    }
});
// PUT /api/symptoms/:id - Update a symptom by ID
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const { name, severity, notes, disorderId } = req.body;
        const updatedSymptom = await db.update(symptoms).set({
            name,
            severity,
            notes,
            disorderId,
        }).where(eq(symptoms.id, id)).returning();
        if (updatedSymptom.length === 0) {
            return res.status(404).json({ error: 'Symptom not found' });
        }
        res.status(200).json(updatedSymptom[0]);
    }
    catch (error) {
        console.error('Error updating symptom:', error);
        res.status(500).json({ error: 'Failed to update symptom' });
    }
});
// DELETE /api/symptoms/:id - Delete a symptom by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const deletedSymptom = await db.delete(symptoms).where(eq(symptoms.id, id)).returning();
        if (deletedSymptom.length === 0) {
            return res.status(404).json({ error: 'Symptom not found' });
        }
        res.status(200).json({ message: `Symptom with ID ${id} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting symptom:', error);
        res.status(500).json({ error: 'Failed to delete symptom' });
    }
});
export default router;
//# sourceMappingURL=symptoms.js.map