import { Router } from 'express';
import { db } from '../db/index.js';
import { medications } from '../schema.js';
import { eq } from 'drizzle-orm';
const router = Router();
// POST /api/medications - Create a new medication
router.post('/', async (req, res) => {
    try {
        const { name, dosage, frequency, prescribedDate, isActive } = req.body;
        // Validation
        if (!name || !prescribedDate) {
            return res.status(400).json({ error: 'Missing required fields: name and prescribedDate' });
        }
        const newMedication = await db.insert(medications).values({
            name,
            dosage,
            frequency,
            prescribedDate,
            isActive: isActive ?? true, // Default to true if not provided
        }).returning();
        res.status(201).json(newMedication[0]);
    }
    catch (error) {
        console.error('Error creating medication:', error);
        res.status(500).json({ error: 'Failed to create medication' });
    }
});
// GET /api/medications - Retrieve all medications
router.get('/', async (req, res) => {
    try {
        const allMedications = await db.select().from(medications);
        res.status(200).json(allMedications);
    }
    catch (error) {
        console.error('Error retrieving medications:', error);
        res.status(500).json({ error: 'Failed to retrieve medications' });
    }
});
// GET /api/medications/:id - Retrieve a single medication by ID
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const medication = await db.select().from(medications).where(eq(medications.id, id));
        if (medication.length === 0) {
            return res.status(404).json({ error: 'Medication not found' });
        }
        res.status(200).json(medication[0]);
    }
    catch (error) {
        console.error('Error retrieving medication:', error);
        res.status(500).json({ error: 'Failed to retrieve medication' });
    }
});
// PUT /api/medications/:id - Update a medication by ID
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const { name, dosage, frequency, prescribedDate, isActive } = req.body;
        const updatedMedication = await db.update(medications).set({
            name,
            dosage,
            frequency,
            prescribedDate,
            isActive,
        }).where(eq(medications.id, id)).returning();
        if (updatedMedication.length === 0) {
            return res.status(404).json({ error: 'Medication not found' });
        }
        res.status(200).json(updatedMedication[0]);
    }
    catch (error) {
        console.error('Error updating medication:', error);
        res.status(500).json({ error: 'Failed to update medication' });
    }
});
// DELETE /api/medications/:id - Delete a medication by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const deletedMedication = await db.delete(medications).where(eq(medications.id, id)).returning();
        if (deletedMedication.length === 0) {
            return res.status(404).json({ error: 'Medication not found' });
        }
        res.status(200).json({ message: `Medication with ID ${id} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting medication:', error);
        res.status(500).json({ error: 'Failed to delete medication' });
    }
});
export default router;
//# sourceMappingURL=medications.js.map