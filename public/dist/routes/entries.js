import { Router } from 'express';
import { db } from '../db/index.js';
import { entries, disorders } from '../schema.js'; // We need disorders for validation
import { eq, desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
const router = Router();
// POST /api/entries - Create a new entry
router.post('/', async (req, res) => {
    try {
        // We get title, content, date, and disorderId from the request body
        const { title, content, date, disorderId } = req.body;
        // Validation: Check for required fields
        if (!date || !disorderId) {
            return res.status(400).json({ error: 'Missing required fields: date and disorderId' });
        }
        // Optional: Check if the disorderId actually exists
        const disorderExists = await db.select().from(disorders).where(eq(disorders.id, disorderId));
        if (disorderExists.length === 0) {
            return res.status(404).json({ error: `Disorder with ID ${disorderId} not found.` });
        }
        const newEntry = await db.insert(entries).values({
            title,
            content,
            date,
            disorderId,
        }).returning();
        res.status(201).json(newEntry[0]);
    }
    catch (error) {
        console.error('Error creating entry:', error);
        res.status(500).json({ error: 'Failed to create entry' });
    }
});
// GET /api/entries - Retrieve all entries, newest first
router.get('/', async (req, res) => {
    try {
        const allEntries = await db.select().from(entries).orderBy(desc(entries.date));
        res.status(200).json(allEntries);
    }
    catch (error) {
        console.error('Error retrieving entries:', error);
        res.status(500).json({ error: 'Failed to retrieve entries' });
    }
});
// GET /api/entries/:id - Retrieve a single entry by ID
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const entry = await db.select().from(entries).where(eq(entries.id, id));
        if (entry.length === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.status(200).json(entry[0]);
    }
    catch (error) {
        console.error('Error retrieving entry:', error);
        res.status(500).json({ error: 'Failed to retrieve entry' });
    }
});
// GET /api/entries/analytics/symptom-trends?timespan=30
router.get('/analytics/symptom-trends', async (req, res) => {
    try {
        // Read the timespan from the query parameter, default to 7 days
        const timespan = parseInt(req.query.timespan, 10) || 7;
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - timespan);
        const recentEntries = await db.select().from(entries).where(sql `date >= ${targetDate.toISOString()}`);
        const allDisorders = await db.select().from(disorders);
        const analyticsData = {};
        allDisorders.forEach(d => { analyticsData[d.id] = {}; });
        for (const entry of recentEntries) {
            const day = entry.date.substring(0, 10);
            if (entry.disorderId === null)
                continue;
            const disorderId = entry.disorderId;
            const disorderSymptomData = analyticsData[disorderId];
            if (!disorderSymptomData)
                continue;
            try {
                const content = JSON.parse(entry.content || '{}');
                if (content.symptoms && Array.isArray(content.symptoms)) {
                    for (const s of content.symptoms) {
                        if (typeof s.name === 'string' && typeof s.severity === 'number') {
                            if (!disorderSymptomData[s.name]) {
                                disorderSymptomData[s.name] = {};
                            }
                            disorderSymptomData[s.name][day] = s.severity;
                        }
                    }
                }
            }
            catch (e) { /* Ignore */ }
        }
        const labels = [];
        for (let i = timespan - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            labels.push(d.toISOString().substring(0, 10));
        }
        const finalChartData = allDisorders.map(disorder => {
            const symptomData = analyticsData[disorder.id];
            const datasets = symptomData ? Object.keys(symptomData).map((symptomName, index) => {
                const color = `hsl(${(index * 60) % 360}, 70%, 50%)`;
                const dataValues = symptomData[symptomName];
                const dataPoints = dataValues ? labels.map(label => dataValues[label] || 0) : labels.map(() => 0);
                return {
                    label: symptomName,
                    data: dataPoints,
                    borderColor: color,
                    backgroundColor: color.replace(')', ', 0.1)'),
                    fill: true,
                    tension: 0.1
                };
            }) : [];
            return { disorderName: disorder.fullName, labels, datasets };
        });
        res.status(200).json(finalChartData);
    }
    catch (error) {
        console.error('Error fetching symptom trend data:', error);
        res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
});
// PUT /api/entries/:id - Update an entry by ID
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const { title, content, date, disorderId } = req.body;
        const updatedEntry = await db.update(entries).set({
            title,
            content,
            date,
            disorderId,
        }).where(eq(entries.id, id)).returning();
        if (updatedEntry.length === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.status(200).json(updatedEntry[0]);
    }
    catch (error) {
        console.error('Error updating entry:', error);
        res.status(500).json({ error: 'Failed to update entry' });
    }
});
// DELETE /api/entries/:id - Delete an entry by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const deletedEntry = await db.delete(entries).where(eq(entries.id, id)).returning();
        if (deletedEntry.length === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.status(200).json({ message: `Entry with ID ${id} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting entry:', error);
        res.status(500).json({ error: 'Failed to delete entry' });
    }
});
export default router;
//# sourceMappingURL=entries.js.map