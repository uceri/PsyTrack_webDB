import { Router } from 'express';
import { db } from '../db/index.js';
import { entries, medicationLogs, switches, alters, medications } from '../schema.js';
import { sql } from 'drizzle-orm';
const router = Router();
// GET /api/logs/daily/:date (date in YYYY-MM-DD format)
router.get('/daily/:date', async (req, res) => {
    try {
        const date = req.params.date; // e.g., "2025-08-07"
        const startDate = `${date}T00:00:00.000Z`;
        const endDate = `${date}T23:59:59.999Z`;
        // Fetch all data for that day
        const dayEntries = await db.select().from(entries).where(sql `date >= ${startDate} AND date <= ${endDate}`);
        const daySwitches = await db.select().from(switches).where(sql `date >= ${startDate} AND date <= ${endDate}`);
        const dayMedLogs = await db.select().from(medicationLogs).where(sql `date >= ${startDate} AND date <= ${endDate}`);
        // Fetch related data for context
        const allAlters = await db.select().from(alters);
        const allMeds = await db.select().from(medications);
        // --- Build the Text Report ---
        let report = `PsyTrack Daily Log for ${date}\n`;
        report += `========================================\n\n`;
        report += `--- Journal Entries (${dayEntries.length}) ---\n`;
        if (dayEntries.length > 0) {
            dayEntries.forEach(entry => {
                report += `[${new Date(entry.date).toLocaleTimeString()}] ${entry.title || 'Untitled'}\n`;
                try {
                    const content = JSON.parse(entry.content || '{}');
                    const frontingAlter = allAlters.find(a => a.id === content.frontingAlterId);
                    report += `  Fronting Alter: ${frontingAlter ? frontingAlter.name : 'Unknown'}\n`;
                    if (content.symptoms && content.symptoms.length > 0) {
                        report += `  Symptoms Logged:\n`;
                        content.symptoms.forEach((s) => {
                            report += `    - ${s.name} (Severity: ${s.severity}/10)\n`;
                        });
                    }
                }
                catch (e) {
                    report += `  Content: ${entry.content}\n`;
                }
                report += `\n`;
            });
        }
        else {
            report += `No journal entries logged.\n\n`;
        }
        report += `--- Alter Switches (${daySwitches.length}) ---\n`;
        if (daySwitches.length > 0) {
            daySwitches.forEach(s => {
                const from = allAlters.find(a => a.id === s.fromAlterId)?.name || 'Unknown';
                const to = allAlters.find(a => a.id === s.toAlterId)?.name || 'Unknown';
                report += `[${new Date(s.date).toLocaleTimeString()}] Switch: ${from} -> ${to}\n`;
                if (s.notes)
                    report += `  Notes: ${s.notes}\n`;
            });
        }
        else {
            report += `No switches logged.\n\n`;
        }
        report += `--- Medication Logs (${dayMedLogs.length}) ---\n`;
        if (dayMedLogs.length > 0) {
            dayMedLogs.forEach(log => {
                const med = allMeds.find(m => m.id === log.medicationId)?.name || 'Unknown Medication';
                report += `[${new Date(log.date).toLocaleTimeString()}] ${med} - Dose: ${log.doseTaken || 'N/A'}\n`;
                if (log.notes)
                    report += `  Notes: ${log.notes}\n`;
            });
        }
        else {
            report += `No medications logged.\n\n`;
        }
        // Set headers to send a plain text response
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(report);
    }
    catch (error) {
        console.error('Error generating daily log:', error);
        res.status(500).json({ error: 'Failed to generate daily log' });
    }
});
export default router;
//# sourceMappingURL=logs.js.map