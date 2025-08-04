import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
// --- IMPORT ALL YOUR API ROUTERS ---
import altersRouter from './routes/alters.js';
import disordersRouter from './routes/disorders.js';
import entriesRouter from './routes/entries.js';
import medicationLogsRouter from './routes/medicationLogs.js';
import medicationsRouter from './routes/medications.js';
import switchesRouter from './routes/switches.js';
import symptomsRouter from './routes/symptoms.js';
import therapySessionsRouter from './routes/therapy_sessions.js';
import treatmentPlansRouter from './routes/treatment_plans.js';
import crisisPlansRouter from './routes/crisis_plans.js';
import logsRouter from './routes/logs.js';
// --- SETUP ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const app = express();
const port = process.env.PORT || 4000;
// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
}));
// ========================================================
// PRIORITY 1: AUTHENTICATION ROUTES
// ========================================================
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!adminUsername || !adminPasswordHash) {
        return res.status(500).json({ error: 'Admin credentials not configured.' });
    }
    const isUsernameCorrect = username === adminUsername;
    const isPasswordCorrect = await bcrypt.compare(password, adminPasswordHash);
    if (isUsernameCorrect && isPasswordCorrect) {
        // @ts-ignore
        req.session.isLoggedIn = true;
        res.status(200).json({ message: 'Login successful' });
    }
    else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});
// ========================================================
// PRIORITY 2: PROTECTED API ROUTES
// ========================================================
const requireAuth = (req, res, next) => {
    // @ts-ignore
    if (req.session && req.session.isLoggedIn) {
        next();
    }
    else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
// --- PRIORITY 2: API ROUTES ---
app.use('/api/alters', altersRouter);
app.use('/api/disorders', disordersRouter);
app.use('/api/entries', entriesRouter);
app.use('/api/medication-logs', medicationLogsRouter);
app.use('/api/medications', medicationsRouter);
app.use('/api/switches', switchesRouter);
app.use('/api/symptoms', symptomsRouter);
app.use('/api/therapy-sessions', therapySessionsRouter);
app.use('/api/treatment-plans', treatmentPlansRouter);
app.use('/api/crisis-plans', crisisPlansRouter);
app.use('/api/logs', logsRouter);
// ========================================================
// PRIORITY 3: FRONTEND SERVING
// ========================================================
// Middleware to protect the main application page
const serveAppOrRedirect = (req, res, next) => {
    // @ts-ignore
    if (req.session && req.session.isLoggedIn) {
        // If logged in, serve the main app file from the static folder
        next();
    }
    else {
        // If not logged in, redirect to the login page
        res.redirect('/login.html');
    }
};
// For the root path, check auth BEFORE trying to serve static files
app.get('/', serveAppOrRedirect);
// Serve all files from the public folder (login.html, css, compiled js)
app.use(express.static(path.join(projectRoot, 'public')));
// The catch-all is the last resort
app.get('*', (req, res) => {
    res.redirect('/login.html');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map