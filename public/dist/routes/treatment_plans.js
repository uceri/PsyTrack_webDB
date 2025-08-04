import { Router } from 'express';
import { db } from '../db/index.js';
import { treatmentPlans, disorders } from '../schema.js';
import { eq } from 'drizzle-orm';
const router = Router();
// POST /api/treatment-plans - Create a new treatment plan
router.post('/', async (req, res) => {
    try {
        const { name, description, startDate, disorderId } = req.body;
        if (!name || !startDate || !disorderId) {
            return res.status(400).json({ error: 'Missing required fields: name, startDate, and disorderId' });
        }
        const disorderExists = await db.select().from(disorders).where(eq(disorders.id, disorderId));
        if (disorderExists.length === 0) {
            return res.status(404).json({ error: `Disorder with ID ${disorderId} not found.` });
        }
        const newPlan = await db.insert(treatmentPlans).values({
            name,
            description,
            startDate,
            disorderId
        }).returning();
        res.status(201).json(newPlan[0]);
    }
    catch (error) {
        console.error('Error creating treatment plan:', error);
        res.status(500).json({ error: 'Failed to create treatment plan' });
    }
});
// GET /api/treatment-plans - Retrieve all plans
router.get('/', async (req, res) => {
    try {
        const allPlans = await db.select().from(treatmentPlans);
        res.status(200).json(allPlans);
    }
    catch (error) {
        console.error('Error retrieving treatment plans:', error);
        res.status(500).json({ error: 'Failed to retrieve treatment plans' });
    }
});
// GET /api/treatment-plans/:id - Retrieve a single plan
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const plan = await db.select().from(treatmentPlans).where(eq(treatmentPlans.id, id));
        if (plan.length === 0) {
            return res.status(404).json({ error: 'Treatment plan not found' });
        }
        res.status(200).json(plan[0]);
    }
    catch (error) {
        console.error('Error retrieving treatment plan:', error);
        res.status(500).json({ error: 'Failed to retrieve treatment plan' });
    }
});
// PUT /api/treatment-plans/:id - Update a plan
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const { name, description, startDate, disorderId } = req.body;
        const updatedPlan = await db.update(treatmentPlans).set({
            name,
            description,
            startDate,
            disorderId,
        }).where(eq(treatmentPlans.id, id)).returning();
        if (updatedPlan.length === 0) {
            return res.status(404).json({ error: 'Treatment plan not found' });
        }
        res.status(200).json(updatedPlan[0]);
    }
    catch (error) {
        console.error('Error updating treatment plan:', error);
        res.status(500).json({ error: 'Failed to update treatment plan' });
    }
});
// DELETE /api/treatment-plans/:id - Delete a plan
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const deletedPlan = await db.delete(treatmentPlans).where(eq(treatmentPlans.id, id)).returning();
        if (deletedPlan.length === 0) {
            return res.status(404).json({ error: 'Treatment plan not found' });
        }
        res.status(200).json({ message: `Treatment plan with ID ${id} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting treatment plan:', error);
        res.status(500).json({ error: 'Failed to delete treatment plan' });
    }
});
export default router;
//# sourceMappingURL=treatment_plans.js.map