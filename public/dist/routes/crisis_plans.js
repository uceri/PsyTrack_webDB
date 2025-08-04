import { Router } from 'express';
import { db } from '../db/index.js';
import { crisisPlans, disorders } from '../schema.js';
import { eq } from 'drizzle-orm';
const router = Router();
// POST /api/crisis-plans - Create a new crisis plan
router.post('/', async (req, res) => {
    try {
        const { name, description, disorderId } = req.body;
        if (!name || !disorderId) {
            return res.status(400).json({ error: 'Missing required fields: name and disorderId' });
        }
        const disorderExists = await db.select().from(disorders).where(eq(disorders.id, disorderId));
        if (disorderExists.length === 0) {
            return res.status(404).json({ error: `Disorder with ID ${disorderId} not found.` });
        }
        const newPlan = await db.insert(crisisPlans).values({
            name,
            description,
            disorderId
        }).returning();
        res.status(201).json(newPlan[0]);
    }
    catch (error) {
        console.error('Error creating crisis plan:', error);
        res.status(500).json({ error: 'Failed to create crisis plan' });
    }
});
// GET /api/crisis-plans - Retrieve all plans
router.get('/', async (req, res) => {
    try {
        const allPlans = await db.select().from(crisisPlans);
        res.status(200).json(allPlans);
    }
    catch (error) {
        console.error('Error retrieving crisis plans:', error);
        res.status(500).json({ error: 'Failed to retrieve crisis plans' });
    }
});
// GET /api/crisis-plans/:id - Retrieve a single plan
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const plan = await db.select().from(crisisPlans).where(eq(crisisPlans.id, id));
        if (plan.length === 0) {
            return res.status(404).json({ error: 'Crisis plan not found' });
        }
        res.status(200).json(plan[0]);
    }
    catch (error) {
        console.error('Error retrieving crisis plan:', error);
        res.status(500).json({ error: 'Failed to retrieve crisis plan' });
    }
});
// PUT /api/crisis-plans/:id - Update a plan
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const { name, description, disorderId } = req.body;
        const updatedPlan = await db.update(crisisPlans).set({
            name,
            description,
            disorderId,
        }).where(eq(crisisPlans.id, id)).returning();
        if (updatedPlan.length === 0) {
            return res.status(404).json({ error: 'Crisis plan not found' });
        }
        res.status(200).json(updatedPlan[0]);
    }
    catch (error) {
        console.error('Error updating crisis plan:', error);
        res.status(500).json({ error: 'Failed to update crisis plan' });
    }
});
// DELETE /api/crisis-plans/:id - Delete a plan
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const deletedPlan = await db.delete(crisisPlans).where(eq(crisisPlans.id, id)).returning();
        if (deletedPlan.length === 0) {
            return res.status(404).json({ error: 'Crisis plan not found' });
        }
        res.status(200).json({ message: `Crisis plan with ID ${id} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting crisis plan:', error);
        res.status(500).json({ error: 'Failed to delete crisis plan' });
    }
});
export default router;
//# sourceMappingURL=crisis_plans.js.map