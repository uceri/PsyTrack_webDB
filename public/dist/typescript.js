import { disorders, symptoms, entries, alters, switches, medications, medicationLogs, triggers, therapySessions, goals, crisisContacts, copingStrategies } from "./shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";
export class MemStorage {
    disorders = new Map();
    symptoms = new Map();
    entries = new Map();
    alters = new Map();
    switches = new Map();
    currentId = 1;
    constructor() {
        this.initializeData();
    }
    updateAlter(id, alter) {
        throw new Error("Method not implemented.");
    }
    getMedications() {
        throw new Error("Method not implemented.");
    }
    getActiveMedications() {
        throw new Error("Method not implemented.");
    }
    createMedication(medication) {
        throw new Error("Method not implemented.");
    }
    updateMedication(id, medication) {
        throw new Error("Method not implemented.");
    }
    getMedicationLogs(medicationId, limit) {
        throw new Error("Method not implemented.");
    }
    createMedicationLog(log) {
        throw new Error("Method not implemented.");
    }
    getTriggers() {
        throw new Error("Method not implemented.");
    }
    createTrigger(trigger) {
        throw new Error("Method not implemented.");
    }
    updateTrigger(id, trigger) {
        throw new Error("Method not implemented.");
    }
    getTherapySessions(limit) {
        throw new Error("Method not implemented.");
    }
    createTherapySession(session) {
        throw new Error("Method not implemented.");
    }
    updateTherapySession(id, session) {
        throw new Error("Method not implemented.");
    }
    getGoals() {
        throw new Error("Method not implemented.");
    }
    createGoal(goal) {
        throw new Error("Method not implemented.");
    }
    updateGoal(id, goal) {
        throw new Error("Method not implemented.");
    }
    getCrisisContacts() {
        throw new Error("Method not implemented.");
    }
    createCrisisContact(contact) {
        throw new Error("Method not implemented.");
    }
    updateCrisisContact(id, contact) {
        throw new Error("Method not implemented.");
    }
    getCopingStrategies() {
        throw new Error("Method not implemented.");
    }
    createCopingStrategy(strategy) {
        throw new Error("Method not implemented.");
    }
    updateCopingStrategy(id, strategy) {
        throw new Error("Method not implemented.");
    }
    getAdvancedAnalytics() {
        throw new Error("Method not implemented.");
    }
    initializeData() {
        // Initialize disorders
        const disorderData = [
            { id: 1, name: "BD.2", acronym: "BD.2", fullName: "Bipolar IIDisorder" },
            { id: 2, name: "DID", acronym: "DID", fullName: "DissociativeIdentity Disorder" },
            { id: 3, name: "ASPD/PP", acronym: "ASPD/PP", fullName: "AntisocialPersonality Disorder/Psychopathy" },
            { id: 4, name: "BPD", acronym: "BPD", fullName: "BorderlinePersonality Disorder" },
            { id: 5, name: "GD/TI", acronym: "GD/TI", fullName: "GenderDysphoria/Trans-Identity" }
        ];
        disorderData.forEach(disorder => this.disorders.set(disorder.id, disorder));
        // Initialize symptoms for each disorder with clinical terminology
        const symptomData = [
            // BD.2 Symptoms - Hypomanic Episodes
            { id: 1, disorderId: 1, name: "Euphoria/irritability", category: "Hypomanic" },
            { id: 2, disorderId: 1, name: "Grandiosity", category: "Hypomanic" },
            { id: 3, disorderId: 1, name: "Decreased sleep need", category: "Hypomanic" },
            { id: 4, disorderId: 1, name: "Pressured speech", category: "Hypomanic" },
            { id: 5, disorderId: 1, name: "Flight of ideas", category: "Hypomanic" },
            { id: 6, disorderId: 1, name: "Distractibility", category: "Hypomanic" },
            { id: 7, disorderId: 1, name: "Psychomotor agitation", category: "Hypomanic" },
            { id: 8, disorderId: 1, name: "Poor judgment", category: "Hypomanic"
            },
            // BD.2 Symptoms - Depressive Episodes
            { id: 9, disorderId: 1, name: "Depressed mood", category: "Depressive" },
            { id: 10, disorderId: 1, name: "Anhedonia", category: "Depressive" },
            { id: 11, disorderId: 1, name: "Weight/appetite changes", category: "Depressive" },
            { id: 12, disorderId: 1, name: "Sleep disturbance", category: "Depressive" },
            { id: 13, disorderId: 1, name: "Psychomotor changes", category: "Depressive" },
            { id: 14, disorderId: 1, name: "Anergia", category: "Depressive" },
            { id: 15, disorderId: 1, name: "Guilt/worthlessness", category: "Depressive" },
            { id: 16, disorderId: 1, name: "Cognitive impairment", category: "Depressive" },
            { id: 17, disorderId: 1, name: "Suicidal ideation", category: "Depressive" },
            // BD.2 Symptoms - Mixed Features
            { id: 18, disorderId: 1, name: "Dysphoric mania", category: "Mixed" },
            { id: 19, disorderId: 1, name: "Rapid cycling", category: "Mixed" },
            // DID Symptoms - Core Features
            { id: 20, disorderId: 2, name: "Alters present (Alicia, Vanessa,Lily)", category: "Core" },
            { id: 21, disorderId: 2, name: "Switching episodes", category: "Core"
            },
            { id: 22, disorderId: 2, name: "Identity confusion", category: "Core"
            },
            { id: 23, disorderId: 2, name: "Depersonalization", category: "Core"
            },
            { id: 24, disorderId: 2, name: "Derealization", category: "Core" },
            // DID Symptoms - Memory
            { id: 25, disorderId: 2, name: "Dissociative amnesia", category: "Memory" },
            { id: 26, disorderId: 2, name: "Inter-identity amnesia", category: "Memory" },
            { id: 27, disorderId: 2, name: "Micro-amnesias", category: "Memory" },
            // DID Symptoms - Associated
            { id: 28, disorderId: 2, name: "Internal voices", category: "Associated" },
            { id: 29, disorderId: 2, name: "Co-consciousness", category: "Associated" },
            { id: 30, disorderId: 2, name: "Passive influence", category: "Associated" },
            { id: 31, disorderId: 2, name: "Somatic switching symptoms",
                category: "Associated" },
            // ASPD/PP Symptoms - Interpersonal/Affective
            { id: 32, disorderId: 3, name: "Superficial charm", category: "Interpersonal/Affective" },
            { id: 33, disorderId: 3, name: "Grandiosity", category: "Interpersonal/Affective" },
            { id: 34, disorderId: 3, name: "Pathological lying", category: "Interpersonal/Affective" },
            { id: 35, disorderId: 3, name: "Lack of remorse", category: "Interpersonal/Affective" },
            { id: 36, disorderId: 3, name: "Shallow affect", category: "Interpersonal/Affective" },
            { id: 37, disorderId: 3, name: "Lack of empathy", category: "Interpersonal/Affective" },
            // ASPD/PP Symptoms - Behavioral
            { id: 38, disorderId: 3, name: "Stimulation seeking", category: "Behavioral" },
            { id: 39, disorderId: 3, name: "Poor behavioral control", category: "Behavioral" },
            { id: 40, disorderId: 3, name: "Impulsivity", category: "Behavioral"
            },
            { id: 41, disorderId: 3, name: "Irresponsibility", category: "Behavioral" },
            { id: 42, disorderId: 3, name: "Parasitic lifestyle", category: "Behavioral" },
            { id: 43, disorderId: 3, name: "Aggression", category: "Behavioral" },
            // BPD Symptoms - Core Features
            { id: 44, disorderId: 4, name: "Abandonment fears", category: "Core"
            },
            { id: 45, disorderId: 4, name: "Unstable relationships", category: "Core" },
            { id: 46, disorderId: 4, name: "Identity disturbance", category: "Core" },
            { id: 47, disorderId: 4, name: "Impulsivity", category: "Core" },
            { id: 48, disorderId: 4, name: "Suicidal behavior/NSSI", category: "Core" },
            { id: 49, disorderId: 4, name: "Affective instability", category: "Core" },
            { id: 50, disorderId: 4, name: "Chronic emptiness", category: "Core"
            },
            { id: 51, disorderId: 4, name: "Inappropriate anger", category: "Core" },
            { id: 52, disorderId: 4, name: "Stress-relatedparanoia/dissociation", category: "Core" },
            // BPD Symptoms - Additional
            { id: 53, disorderId: 4, name: "Splitting", category: "Additional" },
            { id: 54, disorderId: 4, name: "Affect dysregulation", category: "Additional" },
            { id: 55, disorderId: 4, name: "Interpersonal hypersensitivity",
                category: "Additional" },
            // GD/TI Symptoms - Dysphoric
            { id: 56, disorderId: 5, name: "Gender incongruence", category: "Dysphoric" },
            { id: 57, disorderId: 5, name: "Body dysphoria", category: "Dysphoric" },
            { id: 58, disorderId: 5, name: "Social dysphoria", category: "Dysphoric" },
            { id: 59, disorderId: 5, name: "Anatomical dysphoria", category: "Dysphoric" },
            { id: 60, disorderId: 5, name: "Voice dysphoria", category: "Dysphoric" },
            { id: 61, disorderId: 5, name: "Gender identity distress", category: "Dysphoric" },
            { id: 62, disorderId: 5, name: "Minority stress", category: "Dysphoric" },
            { id: 63, disorderId: 5, name: "Internalized transphobia", category: "Dysphoric" },
            { id: 64, disorderId: 5, name: "Identity confusion", category: "Dysphoric" },
            { id: 65, disorderId: 5, name: "Dysphoric episodes", category: "Dysphoric" },
            { id: 66, disorderId: 5, name: "Passing anxiety", category: "Dysphoric" },
            { id: 67, disorderId: 5, name: "Misgendering distress", category: "Dysphoric" },
            { id: 68, disorderId: 5, name: "Social rejection fears", category: "Dysphoric" },
            { id: 69, disorderId: 5, name: "Coming out stress", category: "Dysphoric" },
            { id: 70, disorderId: 5, name: "Discrimination anxiety", category: "Dysphoric" },
            { id: 71, disorderId: 5, name: "Binding discomfort", category: "Dysphoric" },
            { id: 72, disorderId: 5, name: "Hormone fluctuation effects",
                category: "Dysphoric" },
            { id: 73, disorderId: 5, name: "Medical transition anxiety",
                category: "Dysphoric" },
            // GD/TI Symptoms - Positive/Euphoric
            { id: 74, disorderId: 5, name: "Physical euphoria", category: "Positive/Euphoric" },
            { id: 75, disorderId: 5, name: "Gender euphoria", category: "Positive/Euphoric" },
            { id: 76, disorderId: 5, name: "Social affirmation high", category: "Positive/Euphoric" },
            { id: 77, disorderId: 5, name: "Passing euphoria", category: "Positive/Euphoric" },
            { id: 78, disorderId: 5, name: "Identity congruence feelings",
                category: "Positive/Euphoric" },
            { id: 79, disorderId: 5, name: "Body satisfaction moments", category: "Positive/Euphoric" },
            { id: 80, disorderId: 5, name: "Voice satisfaction", category: "Positive/Euphoric" },
            { id: 81, disorderId: 5, name: "Clothing euphoria", category: "Positive/Euphoric" },
            { id: 82, disorderId: 5, name: "Pronoun validation joy", category: "Positive/Euphoric" },
            { id: 83, disorderId: 5, name: "Medical transition milestones",
                category: "Positive/Euphoric" },
            { id: 84, disorderId: 5, name: "Community connection high", category: "Positive/Euphoric" },
            { id: 85, disorderId: 5, name: "Self-acceptance moments", category: "Positive/Euphoric" }
        ];
        symptomData.forEach(symptom => this.symptoms.set(symptom.id, symptom));
        // Initialize alters
        const alterData = [
            { id: 1, name: "Alicia", isActive: 1, lastActive: new Date() },
            { id: 2, name: "Vanessa", isActive: 0, lastActive: new Date(Date.now() - 86400000) },
            { id: 3, name: "Lily", isActive: 0, lastActive: new Date(Date.now() -
                    172800000) }
        ];
        alterData.forEach(alter => this.alters.set(alter.id, alter));
        this.currentId = 86;
    }
    async getDisorders() {
        return Array.from(this.disorders.values());
    }
    async createDisorder(disorder) {
        const id = this.currentId++;
        const newDisorder = { ...disorder, id };
        this.disorders.set(id, newDisorder);
        return newDisorder;
    }
    async getSymptomsByDisorder(disorderId) {
        return Array.from(this.symptoms.values()).filter(s => s.disorderId ===
            disorderId);
    }
    async createSymptom(symptom) {
        const id = this.currentId++;
        const newSymptom = { ...symptom, id };
        this.symptoms.set(id, newSymptom);
        return newSymptom;
    }
    async getEntries(limit = 50, offset = 0) {
        return Array.from(this.entries.values())
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(offset, offset + limit);
    }
    async getEntriesByDisorder(disorderId) {
        return Array.from(this.entries.values()).filter(e => e.disorderId ===
            disorderId);
    }
    async getEntriesByDateRange(startDate, endDate) {
        return Array.from(this.entries.values()).filter(e => {
            const entryDate = new Date(e.timestamp);
            return entryDate >= startDate && entryDate <= endDate;
        });
    }
    async createEntry(entry) {
        const id = this.currentId++;
        const newEntry = {
            ...entry,
            id,
            timestamp: new Date()
        };
        this.entries.set(id, newEntry);
        return newEntry;
    }
    async getAlters() {
        return Array.from(this.alters.values());
    }
    async getActiveAlter() {
        return Array.from(this.alters.values()).find(a => a.isActive === 1);
    }
    async updateAlterStatus(id, isActive) {
        const alter = this.alters.get(id);
        if (!alter)
            throw new Error("Alter not found");
        // Deactivate all alters first if setting one to active
        if (isActive) {
            this.alters.forEach((a, key) => {
                if (a.isActive === 1) {
                    this.alters.set(key, { ...a, isActive: 0 });
                }
            });
        }
        const updatedAlter = {
            ...alter,
            isActive: isActive ? 1 : 0,
            lastActive: isActive ? new Date() : alter.lastActive
        };
        this.alters.set(id, updatedAlter);
        return updatedAlter;
    }
    async createAlter(alter) {
        const id = this.currentId++;
        const newAlter = {
            ...alter,
            id,
            lastActive: new Date()
        };
        this.alters.set(id, newAlter);
        return newAlter;
    }
    async getSwitches(limit = 50) {
        return Array.from(this.switches.values())
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    }
    async createSwitch(switchEntry) {
        const id = this.currentId++;
        const newSwitch = {
            ...switchEntry,
            id,
            timestamp: new Date()
        };
        this.switches.set(id, newSwitch);
        return newSwitch;
    }
    async getAnalytics() {
        const entries = Array.from(this.entries.values());
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEntries = entries.filter(e => {
            const entryDate = new Date(e.timestamp);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === today.getTime();
        }).length;
        let totalSeverity = 0;
        let totalSymptoms = 0;
        const disorderCounts = {};
        entries.forEach(entry => {
            disorderCounts[entry.disorderId] = (disorderCounts[entry.disorderId]
                || 0) + 1;
            entry.symptoms.forEach(s => {
                totalSeverity += s.severity;
                totalSymptoms++;
            });
        });
        const mostActiveDisorderId = Object.entries(disorderCounts)
            .reduce((a, b) => disorderCounts[parseInt(a[0])] >
            disorderCounts[parseInt(b[0])] ? a : b)[0];
        const mostActiveDisorder = this.disorders.get(parseInt(mostActiveDisorderId))?.acronym || "N/A";
        return {
            totalEntries: entries.length,
            avgSeverity: totalSymptoms > 0 ? Math.round((totalSeverity /
                totalSymptoms) * 10) / 10 : 0,
            mostActiveDisorder,
            consecutiveDays: this.calculateStreak(entries),
            todayEntries
        };
    }
    calculateStreak(entries) {
        if (entries.length === 0)
            return 0;
        const dates = new Set();
        entries.forEach(entry => {
            const date = new Date(entry.timestamp);
            date.setHours(0, 0, 0, 0);
            dates.add(date.toISOString());
        });
        const sortedDates = Array.from(dates).sort().reverse();
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 0; i < sortedDates.length; i++) {
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);
            if (sortedDates[i] === expectedDate.toISOString()) {
                streak++;
            }
            else {
                break;
            }
        }
        return streak;
    }
}
export class DatabaseStorage {
    async getDisorders() {
        return await db.select().from(disorders);
    }
    async createDisorder(disorder) {
        const [result] = await db.insert(disorders).values(disorder).returning();
        return result;
    }
    async getSymptomsByDisorder(disorderId) {
        return await db.select().from(symptoms).where(eq(symptoms.disorderId, disorderId));
    }
    async createSymptom(symptom) {
        const [result] = await db.insert(symptoms).values(symptom).returning();
        return result;
    }
    async getEntries(limit = 50, offset = 0) {
        return await db.select().from(entries)
            .orderBy(desc(entries.timestamp))
            .limit(limit)
            .offset(offset);
    }
    async getEntriesByDisorder(disorderId) {
        return await db.select().from(entries)
            .where(eq(entries.disorderId, disorderId))
            .orderBy(desc(entries.timestamp));
    }
    async getEntriesByDateRange(startDate, endDate) {
        return await db.select().from(entries)
            .where(and(gte(entries.timestamp, startDate), lte(entries.timestamp, endDate)))
            .orderBy(desc(entries.timestamp));
    }
    async createEntry(entry) {
        const [result] = await db.insert(entries).values(entry).returning();
        return result;
    }
    async getAlters() {
        return await db.select().from(alters);
    }
    async getActiveAlter() {
        const [result] = await db.select().from(alters).where(eq(alters.isActive, 1));
        return result || undefined;
    }
    async updateAlterStatus(id, isActive) {
        // First, deactivate all alters if setting one to active
        if (isActive) {
            await db.update(alters).set({ isActive: 0
            }).where(eq(alters.isActive, 1));
        }
        const [result] = await db.update(alters)
            .set({
            isActive: isActive ? 1 : 0,
            lastActive: isActive ? new Date() : undefined
        })
            .where(eq(alters.id, id))
            .returning();
        return result;
    }
    async createAlter(alter) {
        const [result] = await db.insert(alters).values(alter).returning();
        return result;
    }
    async updateAlter(id, alter) {
        const [result] = await db.update(alters)
            .set(alter)
            .where(eq(alters.id, id))
            .returning();
        return result;
    }
    async getSwitches(limit = 50) {
        return await db.select().from(switches)
            .orderBy(desc(switches.timestamp))
            .limit(limit);
    }
    async createSwitch(switchEntry) {
        const [result] = await db.insert(switches).values(switchEntry).returning();
        return result;
    }
    // Medications
    async getMedications() {
        return await db.select().from(medications).orderBy(desc(medications.prescribedDate));
    }
    async getActiveMedications() {
        return await db.select().from(medications).where(eq(medications.isActive, true));
    }
    async createMedication(medication) {
        const [result] = await db.insert(medications).values(medication).returning();
        return result;
    }
    async updateMedication(id, medication) {
        const [result] = await db.update(medications)
            .set(medication)
            .where(eq(medications.id, id))
            .returning();
        return result;
    }
    // Medication Logs
    async getMedicationLogs(medicationId, limit = 50) {
        let query = db.select().from(medicationLogs).orderBy(desc(medicationLogs.timestamp));
        if (medicationId) {
            query = query.where(eq(medicationLogs.medicationId, medicationId));
        }
        return await query.limit(limit);
    }
    async createMedicationLog(log) {
        const [result] = await db.insert(medicationLogs).values(log).returning();
        return result;
    }
    // Triggers
    async getTriggers() {
        return await db.select().from(triggers).orderBy(desc(triggers.severity));
    }
    async createTrigger(trigger) {
        const [result] = await db.insert(triggers).values(trigger).returning();
        return result;
    }
    async updateTrigger(id, trigger) {
        const [result] = await db.update(triggers)
            .set(trigger)
            .where(eq(triggers.id, id))
            .returning();
        return result;
    }
    // Therapy Sessions
    async getTherapySessions(limit = 50) {
        return await db.select().from(therapySessions)
            .orderBy(desc(therapySessions.date))
            .limit(limit);
    }
    async createTherapySession(session) {
        const [result] = await db.insert(therapySessions).values(session).returning();
        return result;
    }
    async updateTherapySession(id, session) {
        const [result] = await db.update(therapySessions)
            .set(session)
            .where(eq(therapySessions.id, id))
            .returning();
        return result;
    }
    // Goals
    async getGoals() {
        return await db.select().from(goals).orderBy(desc(goals.createdAt));
    }
    async createGoal(goal) {
        const [result] = await db.insert(goals).values(goal).returning();
        return result;
    }
    async updateGoal(id, goal) {
        const [result] = await db.update(goals)
            .set(goal)
            .where(eq(goals.id, id))
            .returning();
        return result;
    }
    // Crisis Contacts
    async getCrisisContacts() {
        return await db.select().from(crisisContacts).orderBy(desc(crisisContacts.isEmergency));
    }
    async createCrisisContact(contact) {
        const [result] = await db.insert(crisisContacts).values(contact).returning();
        return result;
    }
    async updateCrisisContact(id, contact) {
        const [result] = await db.update(crisisContacts)
            .set(contact)
            .where(eq(crisisContacts.id, id))
            .returning();
        return result;
    }
    // Coping Strategies
    async getCopingStrategies() {
        return await db.select().from(copingStrategies).orderBy(desc(copingStrategies.effectiveness));
    }
    async createCopingStrategy(strategy) {
        const [result] = await db.insert(copingStrategies).values(strategy).returning();
        return result;
    }
    async updateCopingStrategy(id, strategy) {
        const [result] = await db.update(copingStrategies)
            .set(strategy)
            .where(eq(copingStrategies.id, id))
            .returning();
        return result;
    }
    async getAnalytics() {
        const allEntries = await db.select().from(entries);
        const allDisorders = await db.select().from(disorders);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const todayEntries = allEntries.filter(e => {
            const entryDate = new Date(e.timestamp);
            return entryDate >= today && entryDate < tomorrow;
        }).length;
        let totalSeverity = 0;
        let totalSymptoms = 0;
        const disorderCounts = {};
        allEntries.forEach(entry => {
            disorderCounts[entry.disorderId] = (disorderCounts[entry.disorderId]
                || 0) + 1;
            entry.symptoms.forEach(s => {
                totalSeverity += s.severity;
                totalSymptoms++;
            });
        });
        const mostActiveDisorderId = Object.entries(disorderCounts)
            .reduce((a, b) => disorderCounts[parseInt(a[0])] >
            disorderCounts[parseInt(b[0])] ? a : b, ['0', 0])[0];
        const mostActiveDisorder = allDisorders.find(d => d.id ===
            parseInt(mostActiveDisorderId))?.acronym || "N/A";
        return {
            totalEntries: allEntries.length,
            avgSeverity: totalSymptoms > 0 ? Math.round((totalSeverity /
                totalSymptoms) * 10) / 10 : 0,
            mostActiveDisorder,
            consecutiveDays: this.calculateStreak(allEntries),
            todayEntries
        };
    }
    calculateStreak(entries) {
        if (entries.length === 0)
            return 0;
        const dates = new Set();
        entries.forEach(entry => {
            const date = new Date(entry.timestamp);
            date.setHours(0, 0, 0, 0);
            dates.add(date.toISOString());
        });
        const sortedDates = Array.from(dates).sort().reverse();
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 0; i < sortedDates.length; i++) {
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);
            if (sortedDates[i] === expectedDate.toISOString()) {
                streak++;
            }
            else {
                break;
            }
        }
        return streak;
    }
    async getAdvancedAnalytics() {
        const allEntries = await db.select().from(entries);
        const allMedicationLogs = await db.select().from(medicationLogs);
        // Weekly trends calculation
        const weeklyTrends = this.calculateWeeklyTrends(allEntries);
        // Correlation analysis (sleep vs mood, stress vs symptoms)
        const correlations = this.calculateCorrelations(allEntries);
        // Pattern detection
        const patterns = this.detectPatterns(allEntries);
        // Medication effectiveness
        const medicationEffectiveness = this.calculateMedicationEffectiveness(allMedicationLogs);
        return {
            weeklyTrends,
            correlations,
            patterns,
            medicationEffectiveness
        };
    }
    calculateWeeklyTrends(entries) {
        // Group entries by week and calculate average severity
        const weekMap = new Map();
        entries.forEach(entry => {
            const date = new Date(entry.timestamp);
            const startOfWeek = new Date(date);
            startOfWeek.setDate(date.getDate() - date.getDay());
            const weekKey = startOfWeek.toISOString().split('T')[0];
            if (!weekMap.has(weekKey)) {
                weekMap.set(weekKey, { totalSeverity: 0, count: 0, moods: [] });
            }
            const weekData = weekMap.get(weekKey);
            entry.symptoms.forEach(s => {
                weekData.totalSeverity += s.severity;
                weekData.count++;
            });
            if (entry.mood) {
                weekData.moods.push(entry.mood);
            }
        });
        return Array.from(weekMap.entries()).map(([week, data]) => ({
            week,
            avgSeverity: data.count > 0 ? data.totalSeverity / data.count : 0,
            avgMood: data.moods.length > 0 ? data.moods.reduce((a, b) => a + b, 0) / data.moods.length : null,
            entryCount: data.count
        }));
    }
    calculateCorrelations(entries) {
        const correlations = [];
        // Sleep vs Mood correlation
        const sleepMoodData = entries.filter(e => e.sleepHours && e.mood).map(e => ({
            sleep: e.sleepHours,
            mood: e.mood
        }));
        if (sleepMoodData.length > 1) {
            const sleepMoodCorr = this.pearsonCorrelation(sleepMoodData.map(d => d.sleep), sleepMoodData.map(d => d.mood));
            correlations.push({ type: 'Sleep vs Mood', correlation: sleepMoodCorr
            });
        }
        // Stress vs Symptom Severity correlation
        const stressSeverityData = entries.filter(e => e.stressLevel).map(e => {
            const avgSeverity = e.symptoms.reduce((sum, s) => sum + s.severity, 0) / e.symptoms.length;
            return { stress: e.stressLevel, severity: avgSeverity };
        });
        if (stressSeverityData.length > 1) {
            const stressSeverityCorr = this.pearsonCorrelation(stressSeverityData.map(d => d.stress), stressSeverityData.map(d => d.severity));
            correlations.push({ type: 'Stress vs Symptom Severity', correlation: stressSeverityCorr });
        }
        return correlations;
    }
    detectPatterns(entries) {
        const patterns = [];
        // Time of day patterns
        const timePatterns = this.analyzeTimePatterns(entries);
        patterns.push({ type: 'Time of Day', data: timePatterns });
        // Day of week patterns
        const dayPatterns = this.analyzeDayPatterns(entries);
        patterns.push({ type: 'Day of Week', data: dayPatterns });
        return patterns;
    }
    calculateMedicationEffectiveness(logs) {
        const medicationMap = new Map();
        logs.forEach(log => {
            if (!medicationMap.has(log.medicationId)) {
                medicationMap.set(log.medicationId, { taken: 0, effectiveness: []
                });
            }
            const medData = medicationMap.get(log.medicationId);
            if (log.taken) {
                medData.taken++;
                if (log.effectiveness) {
                    medData.effectiveness.push(log.effectiveness);
                }
            }
        });
        return Array.from(medicationMap.entries()).map(([medicationId, data]) => ({
            medicationId,
            adherenceRate: data.taken / logs.filter(l => l.medicationId ===
                medicationId).length,
            avgEffectiveness: data.effectiveness.length > 0
                ? data.effectiveness.reduce((a, b) => a + b, 0) /
                    data.effectiveness.length
                : null
        }));
    }
    pearsonCorrelation(x, y) {
        const n = x.length;
        if (n === 0)
            return 0;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 -
            sumY * sumY));
        return denominator === 0 ? 0 : numerator / denominator;
    }
    analyzeTimePatterns(entries) {
        const timeMap = new Map();
        entries.forEach(entry => {
            const hour = new Date(entry.timestamp).getHours();
            if (!timeMap.has(hour)) {
                timeMap.set(hour, { count: 0, totalSeverity: 0 });
            }
            const timeData = timeMap.get(hour);
            timeData.count++;
            entry.symptoms.forEach(s => {
                timeData.totalSeverity += s.severity;
            });
        });
        return Array.from(timeMap.entries()).map(([hour, data]) => ({
            hour,
            count: data.count,
            avgSeverity: data.totalSeverity / (data.count *
                entries[0]?.symptoms.length || 1)
        }));
    }
    analyzeDayPatterns(entries) {
        const dayMap = new Map();
        entries.forEach(entry => {
            const day = new Date(entry.timestamp).getDay();
            if (!dayMap.has(day)) {
                dayMap.set(day, { count: 0, totalSeverity: 0 });
            }
            const dayData = dayMap.get(day);
            dayData.count++;
            entry.symptoms.forEach(s => {
                dayData.totalSeverity += s.severity;
            });
        });
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday'];
        return Array.from(dayMap.entries()).map(([day, data]) => ({
            day: dayNames[day],
            count: data.count,
            avgSeverity: data.totalSeverity / (data.count *
                entries[0]?.symptoms.length || 1)
        }));
    }
}
export const storage = new DatabaseStorage();
//# sourceMappingURL=typescript.js.map