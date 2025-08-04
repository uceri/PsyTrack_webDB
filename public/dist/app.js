// =================================================================
// IMPORTS & CONFIG
// =================================================================
import { symptomList } from './symptom-data.js';
const API_BASE_URL = 'http://localhost:4000/api';
// --- State Management ---
let activeAlterId = null;
let disorders = [];
let chartSettings = {
    timespan: 7,
    type: 'line'
};
// =================================================================
// CHART SETTINGS MODAL LOGIC
// =================================================================
function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal)
        modal.style.display = 'flex';
}
function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal)
        modal.style.display = 'none';
}
function loadChartSettings() {
    const savedSettings = localStorage.getItem('psytrackChartSettings');
    if (savedSettings) {
        chartSettings = JSON.parse(savedSettings);
    }
    const timespanSelect = document.getElementById('chart-timespan');
    const typeSelect = document.getElementById('chart-type');
    if (timespanSelect)
        timespanSelect.value = chartSettings.timespan.toString();
    if (typeSelect)
        typeSelect.value = chartSettings.type;
}
function attachSettingsFormListener() {
    const form = document.getElementById('chart-settings-form');
    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        const timespanSelect = document.getElementById('chart-timespan');
        const typeSelect = document.getElementById('chart-type');
        if (timespanSelect && typeSelect) {
            chartSettings.timespan = parseInt(timespanSelect.value, 10);
            chartSettings.type = typeSelect.value;
            localStorage.setItem('psytrackChartSettings', JSON.stringify(chartSettings));
            closeSettingsModal();
            displayDashboardView(); // Re-render with new settings
        }
    });
    document.getElementById('cancel-settings-btn')?.addEventListener('click', closeSettingsModal);
}
// =================================================================
// UI & NAVIGATION LOGIC
// =================================================================
/**
 * Sets the 'active' class on the currently selected sidebar link.
 */
function setActiveSidebarLink(activeLinkId) {
    // First, remove 'active' class from all sidebar links
    document.querySelectorAll('#sidebar a').forEach(link => link.classList.remove('active'));
    // Then, add it to the one that was just clicked
    const activeLink = document.getElementById(activeLinkId);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}
function openNav() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    if (sidebar)
        sidebar.style.width = "250px";
    if (overlay)
        overlay.style.display = "block";
}
function closeNav() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    if (sidebar)
        sidebar.style.width = "0";
    if (overlay)
        overlay.style.display = "none";
}
// =================================================================
// DATA FETCHING & RENDERING
// =================================================================
/**
 * Displays the main dashboard view with analytics charts based on current settings.
 */
async function displayDashboardView() {
    setActiveSidebarLink('dashboard-link');
    const mainContent = document.getElementById("main-content");
    if (!mainContent)
        return;
    mainContent.innerHTML = `
        <div class="view-header">
            <h1>Dashboard</h1>
            <button id="chart-settings-btn" class="secondary-button">Settings</button>
        </div>
        <div id="charts-container"><div class="loader"></div></div>
    `;
    document.getElementById('chart-settings-btn')?.addEventListener('click', openSettingsModal);
    const chartsContainer = document.getElementById('charts-container');
    if (!chartsContainer)
        return;
    try {
        // Use the timespan from settings in the API call
        const response = await fetch(`${API_BASE_URL}/entries/analytics/symptom-trends?timespan=${chartSettings.timespan}`);
        if (!response.ok)
            throw new Error('Failed to fetch chart data');
        const chartsData = await response.json();
        chartsContainer.innerHTML = '';
        if (chartsData.every((c) => c.datasets.length === 0)) {
            chartsContainer.innerHTML = '<p>No symptom data logged in the selected timespan.</p>';
            return;
        }
        chartsData.forEach((chartInfo, index) => {
            if (chartInfo.datasets.length === 0)
                return;
            const chartWrapper = document.createElement('div');
            chartWrapper.className = 'chart-container';
            chartWrapper.innerHTML = `<h2>${chartInfo.disorderName}</h2><canvas id="chart-${index}"></canvas>`;
            chartsContainer.appendChild(chartWrapper);
            const ctx = document.getElementById(`chart-${index}`)?.getContext('2d');
            if (!ctx)
                return;
            new Chart(ctx, {
                type: chartSettings.type, // Use the type from settings
                data: {
                    labels: chartInfo.labels,
                    datasets: chartInfo.datasets
                },
                options: {
                    scales: { y: { beginAtZero: true, max: 10 } },
                    plugins: { legend: { position: 'top' } }
                }
            });
        });
    }
    catch (error) {
        console.error(error);
        if (chartsContainer)
            chartsContainer.innerHTML = `<p>Error loading chart data.</p>`;
    }
}
/**
 * Fetches all entries and displays the database editing view.
 */
async function displayDbEditingView() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent)
        return;
    setActiveSidebarLink('db-edit-link');
    // Create the initial HTML structure
    mainContent.innerHTML = `
        <h1>Database Tools</h1>
        <div class="db-tool-section">
            <h2>Daily Log Exporter</h2>
            <form id="log-exporter-form">
                <input type="date" id="log-date" required>
                <button type="submit" class="save-button">Generate & Download Log</button>
            </form>
        </div>
        <div class="db-tool-section">
            <h2>All Entries</h2>
            <div id="entries-list">Loading...</div>
        </div>
    `;
    // Find the container for the entries list
    const listContainer = document.getElementById('entries-list');
    if (!listContainer)
        return;
    // --- THIS IS THE FIX ---
    // Attach the listener for the exporter form we just created
    attachLogExporterListener();
    // -----------------------
    try {
        const response = await fetch(`${API_BASE_URL}/entries`);
        if (!response.ok)
            throw new Error('Failed to fetch entries');
        const entries = await response.json();
        if (entries.length === 0) {
            listContainer.innerHTML = '<p>No entries found in the database.</p>';
            return;
        }
        listContainer.innerHTML = entries.map(entry => {
            // ... (rest of the mapping logic is the same)
            let contentPreview = entry.content || 'No content.';
            try {
                const parsedContent = JSON.parse(entry.content || '{}');
                if (parsedContent.symptoms && parsedContent.symptoms.length > 0) {
                    contentPreview = `Logged ${parsedContent.symptoms.length} symptom(s).`;
                }
            }
            catch (e) { /* Not JSON */ }
            return `
                <div class="entry-card">
                    <div class="entry-header">
                        <strong>${entry.title || 'Untitled Entry'}</strong> - <em>${new Date(entry.date).toLocaleString()}</em>
                    </div>
                    <div class="entry-content">${contentPreview}</div>
                    <div class="entry-actions">
                        <button class="delete-button" data-entry-id="${entry.id}">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
        attachDeleteButtonListeners();
    }
    catch (error) {
        console.error(error);
        listContainer.innerHTML = '<p>Error loading entries.</p>';
    }
}
/**
 * Attaches click listeners to all delete buttons on the editing page.
 */
function attachDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const entryId = button.dataset.entryId;
            if (entryId) {
                showDeleteConfirmation(parseInt(entryId, 10));
            }
        });
    });
}
/**
 * Shows the secure delete confirmation modal.
 */
function showDeleteConfirmation(entryId) {
    const confirmationString = `4253 Delete this entry 4253`;
    const userInput = prompt(`To delete this entry permanently, please type the following exactly:\n\n${confirmationString}`);
    if (userInput === confirmationString) {
        // If the user typed the string correctly, proceed with deletion
        deleteEntry(entryId);
    }
    else if (userInput !== null) {
        // If the user typed anything else (and didn't just cancel)
        alert('Confirmation string did not match. Deletion cancelled.');
    }
}
/**
 * Executes the API call to delete an entry.
 */
async function deleteEntry(entryId) {
    try {
        const response = await fetch(`${API_BASE_URL}/entries/${entryId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete entry from server.');
        }
        alert('Entry deleted successfully.');
        displayDbEditingView(); // Refresh the view to show the entry is gone
    }
    catch (error) {
        console.error(error);
        alert('An error occurred while deleting the entry.');
    }
}
/**
 * Handles the logic for the daily log exporter form.
 */
function attachLogExporterListener() {
    const form = document.getElementById('log-exporter-form');
    const dateInput = document.getElementById('log-date');
    if (!form || !dateInput) {
        console.error("Log exporter form elements not found.");
        return;
    }
    // Set the default date in the input to today
    dateInput.valueAsDate = new Date();
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const date = dateInput.value; // The value will be in "YYYY-MM-DD" format
        if (!date) {
            alert('Please select a date to export.');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/logs/daily/${date}`);
            if (!response.ok) {
                throw new Error(`Failed to generate log: ${response.statusText}`);
            }
            // Get the report text from the response
            const reportText = await response.text();
            // Create a "blob" (a file-like object in memory) from the text
            const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
            // Create a temporary URL for the blob
            const url = URL.createObjectURL(blob);
            // Create a temporary, invisible link element
            const a = document.createElement('a');
            a.href = url;
            a.download = `PsyTrack-Log-${date}.txt`; // The desired filename
            document.body.appendChild(a); // Add the link to the page
            a.click(); // Programmatically click the link to trigger the download
            // Clean up by removing the link and revoking the temporary URL
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error(error);
            alert('Error generating log. See console for details.');
        }
    });
}
/**
 * Fetches and displays the main Therapy view with appointments and treatment plans.
 */
async function displayTherapyView() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent)
        return;
    setActiveSidebarLink('therapy-link');
    // Set up the static HTML structure for the view
    mainContent.innerHTML = `
        <h1>Therapy</h1>
        <div class="therapy-section">
            <h2>Appointments</h2>
            <div id="appointments-list">Loading...</div>
            <form id="appointment-form" class="therapy-form">
                <h3>Log New Appointment</h3>
                <input type="datetime-local" id="appointment-date" required>
                <input type="text" id="therapist-name" placeholder="Therapist's Name" required>
                <textarea id="appointment-notes" placeholder="Session Notes..."></textarea>
                <select id="appointment-disorder-id" required></select>
                <button type="submit" class="save-button">Save Appointment</button>
            </form>
        </div>
        <div class="therapy-section">
            <h2>Treatment Plans</h2>
            <div id="plans-list">Loading...</div>
            <form id="plan-form" class="therapy-form">
                <h3>Add New Treatment Plan</h3>
                <input type="text" id="plan-name" placeholder="Plan Name" required>
                <input type="date" id="plan-start-date" required>
                <textarea id="plan-description" placeholder="Plan Description..."></textarea>
                <select id="plan-disorder-id" required></select>
                <button type="submit" class="save-button">Save Plan</button>
            </form>
        </div>
    `;
    // Populate the disorder dropdowns in the forms
    populateDisorderDropdowns();
    // Fetch and render the data for both sections
    await Promise.all([
        renderAppointments(),
        renderTreatmentPlans()
    ]);
    // Attach form submission listeners
    attachAppointmentFormListener();
    attachPlanFormListener();
}
/**
 * Populates the disorder select dropdowns in the therapy forms.
 */
function populateDisorderDropdowns() {
    const appointmentSelect = document.getElementById('appointment-disorder-id');
    const planSelect = document.getElementById('plan-disorder-id');
    if (!appointmentSelect || !planSelect || disorders.length === 0)
        return;
    [appointmentSelect, planSelect].forEach(select => {
        select.innerHTML = '<option value="">Select a disorder...</option>';
        disorders.forEach(disorder => {
            const option = document.createElement('option');
            option.value = disorder.id.toString();
            option.textContent = disorder.name;
            select.appendChild(option);
        });
    });
}
/**
 * Fetches and renders the list of therapy sessions.
 */
async function renderAppointments() {
    const listContainer = document.getElementById('appointments-list');
    if (!listContainer)
        return;
    try {
        const response = await fetch(`${API_BASE_URL}/therapy-sessions`);
        if (!response.ok)
            throw new Error('Failed to fetch appointments');
        const sessions = await response.json();
        if (sessions.length === 0) {
            listContainer.innerHTML = '<p>No appointments logged yet.</p>';
            return;
        }
        listContainer.innerHTML = sessions.map(session => `
            <div class="list-item">
                <strong>${new Date(session.date).toLocaleString()}</strong> - ${session.therapistName}
                <p>${session.notes || 'No notes.'}</p>
            </div>
        `).join('');
    }
    catch (error) {
        console.error(error);
        listContainer.innerHTML = '<p>Error loading appointments.</p>';
    }
}
/**
 * Fetches and renders the list of treatment plans.
 */
async function renderTreatmentPlans() {
    const listContainer = document.getElementById('plans-list');
    if (!listContainer)
        return;
    try {
        const response = await fetch(`${API_BASE_URL}/treatment-plans`);
        if (!response.ok)
            throw new Error('Failed to fetch plans');
        const plans = await response.json();
        if (plans.length === 0) {
            listContainer.innerHTML = '<p>No treatment plans created yet.</p>';
            return;
        }
        listContainer.innerHTML = plans.map(plan => `
            <div class="list-item">
                <strong>${plan.name}</strong> (Started: ${new Date(plan.startDate).toLocaleDateString()})
                <p>${plan.description || 'No description.'}</p>
            </div>
        `).join('');
    }
    catch (error) {
        console.error(error);
        listContainer.innerHTML = '<p>Error loading treatment plans.</p>';
    }
}
/**
 * Attaches form listener for adding a new appointment.
 */
function attachAppointmentFormListener() {
    const form = document.getElementById('appointment-form');
    if (!form)
        return;
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const dateInput = document.getElementById('appointment-date');
        const therapistInput = document.getElementById('therapist-name');
        const notesInput = document.getElementById('appointment-notes');
        const disorderSelect = document.getElementById('appointment-disorder-id');
        const data = {
            date: new Date(dateInput.value).toISOString(),
            therapistName: therapistInput.value,
            notes: notesInput.value,
            disorderId: parseInt(disorderSelect.value, 10)
        };
        try {
            const response = await fetch(`${API_BASE_URL}/therapy-sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok)
                throw new Error('Failed to save appointment');
            renderAppointments(); // Re-render the list to show the new item
            form.reset();
        }
        catch (error) {
            console.error(error);
            alert('Error saving appointment.');
        }
    });
}
/**
 * Attaches form listener for adding a new treatment plan.
 */
function attachPlanFormListener() {
    const form = document.getElementById('plan-form');
    if (!form)
        return;
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nameInput = document.getElementById('plan-name');
        const startDateInput = document.getElementById('plan-start-date');
        const descriptionInput = document.getElementById('plan-description');
        const disorderSelect = document.getElementById('plan-disorder-id');
        const data = {
            name: nameInput.value,
            startDate: new Date(startDateInput.value).toISOString(),
            description: descriptionInput.value,
            disorderId: parseInt(disorderSelect.value, 10)
        };
        try {
            const response = await fetch(`${API_BASE_URL}/treatment-plans`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok)
                throw new Error('Failed to save plan');
            renderTreatmentPlans(); // Re-render the list
            form.reset();
        }
        catch (error) {
            console.error(error);
            alert('Error saving treatment plan.');
        }
    });
}
/**
 * Fetches active medications and displays the logging form.
 */
async function displayMedicationLogView() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent)
        return;
    setActiveSidebarLink('meds-link');
    mainContent.innerHTML = `<h1>Medication Log for ${new Date().toLocaleDateString()}</h1>`;
    try {
        const response = await fetch(`${API_BASE_URL}/medications`);
        if (!response.ok)
            throw new Error('Failed to fetch medications');
        const medications = await response.json();
        let formHtml = `<form id="meds-log-form">`;
        medications.forEach(med => {
            formHtml += `
                <div class="med-card" data-med-id="${med.id}">
                    <div class="med-header">
                        <h3>${med.name}</h3>
                        <p>${med.dosage || ''} ${med.frequency || ''}</p>
                    </div>
                    <div class="med-input">
                        <input type="checkbox" class="med-taken-checkbox">
                        <label>Taken</label>
                    </div>
                    <div class="med-details">
                        <input type="text" class="med-dose-taken" placeholder="Actual dose (e.g., 150mg)">
                        <textarea class="med-notes" placeholder="Notes..."></textarea>
                    </div>
                </div>
            `;
        });
        formHtml += `<div class="form-actions"><button type="submit" class="save-button">Save Medication Log</button></div></form>`;
        mainContent.innerHTML += formHtml;
        attachMedLogFormSubmitListener();
    }
    catch (error) {
        console.error(error);
        mainContent.innerHTML += `<p>Error loading medications.</p>`;
    }
}
/**
 * Attaches the event listener for the medication log form submission.
 */
function attachMedLogFormSubmitListener() {
    const form = document.getElementById('meds-log-form');
    if (!form)
        return;
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const logPromises = [];
        const medCards = document.querySelectorAll('.med-card');
        medCards.forEach(card => {
            const checkbox = card.querySelector('.med-taken-checkbox');
            if (checkbox && checkbox.checked) {
                const medicationId = parseInt(card.dataset.medId, 10);
                const doseTakenInput = card.querySelector('.med-dose-taken');
                const notesTextarea = card.querySelector('.med-notes');
                const logData = {
                    medicationId: medicationId,
                    date: new Date().toISOString(),
                    doseTaken: doseTakenInput ? doseTakenInput.value : null,
                    notes: notesTextarea ? notesTextarea.value : null
                };
                const logPromise = fetch(`${API_BASE_URL}/medication-logs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(logData)
                });
                logPromises.push(logPromise);
            }
        });
        if (logPromises.length === 0) {
            alert("No medications marked as 'Taken'. Nothing to log.");
            return;
        }
        try {
            await Promise.all(logPromises);
            alert(`Successfully logged ${logPromises.length} medication(s)!`);
            displayMedicationLogView(); // Refresh the view
        }
        catch (error) {
            console.error(error);
            alert('An error occurred while saving logs. See console for details.');
        }
    });
}
async function populateAlterSwitcher() {
    const switcherContainer = document.getElementById('alter-switcher');
    if (!switcherContainer)
        return;
    try {
        const response = await fetch(`${API_BASE_URL}/alters`);
        if (!response.ok)
            throw new Error('Failed to fetch alters');
        const altersList = await response.json();
        switcherContainer.innerHTML = '';
        altersList.forEach(alter => {
            const button = document.createElement('button');
            button.textContent = alter.name;
            button.dataset.alterId = alter.id.toString();
            button.className = 'alter-button';
            button.addEventListener('click', async () => {
                await handleAlterSwitch(alter.id);
                document.querySelectorAll('.alter-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
            switcherContainer.appendChild(button);
        });
    }
    catch (error) {
        console.error(error);
        switcherContainer.innerHTML = 'Error loading alters.';
    }
}
async function handleAlterSwitch(toAlterId) {
    if (activeAlterId === toAlterId)
        return;
    const didDisorder = disorders.find(d => d.acronym === 'DID' || d.name === 'DID');
    if (!didDisorder) {
        alert("Error: DID disorder not configured. Switch not logged.");
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/switches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fromAlterId: activeAlterId,
                toAlterId: toAlterId,
                date: new Date().toISOString(),
                disorderId: didDisorder.id
            })
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }
        activeAlterId = toAlterId;
        console.log(`Switch logged successfully. Active alter is now ${toAlterId}`);
    }
    catch (error) {
        console.error(error);
        alert('Error: Could not log the switch.');
    }
}
async function populateDisorderLinks() {
    const linksContainer = document.getElementById('disorder-links');
    if (!linksContainer)
        return;
    try {
        const response = await fetch(`${API_BASE_URL}/disorders`);
        if (!response.ok)
            throw new Error('Failed to fetch disorders');
        disorders = await response.json();
        linksContainer.innerHTML = '';
        disorders.forEach(disorder => {
            const link = document.createElement("a");
            link.href = `#`;
            link.textContent = disorder.name;
            link.addEventListener('click', (event) => {
                event.preventDefault();
                displayDisorderContent(disorder);
                closeNav();
            });
            linksContainer.appendChild(link);
        });
    }
    catch (error) {
        console.error(error);
        linksContainer.innerHTML = 'Error loading disorders.';
    }
}
function displayDisorderContent(disorder) {
    const mainContent = document.getElementById("main-content");
    if (!mainContent)
        return;
    const relevantSymptoms = symptomList.filter(s => s.disorderId === disorder.id);
    const categories = {};
    for (const symptom of relevantSymptoms) {
        const category = symptom.category;
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(symptom);
    }
    let formHtml = `<div class="disorder-header"><h1>${disorder.fullName} (${disorder.acronym})</h1></div>`;
    formHtml += `<form id="symptom-form">`;
    for (const categoryName of Object.keys(categories)) {
        const symptomsInCategory = categories[categoryName];
        // THIS IS THE FIX: Add a check to ensure the array exists
        if (symptomsInCategory && symptomsInCategory.length > 0) {
            formHtml += `<div class="symptom-category"><h2>${categoryName}</h2>`;
            for (const symptom of symptomsInCategory) {
                formHtml += `
                    <div class="symptom-slider">
                        <label for="${symptom.name}">${symptom.name}</label>
                        <input type="range" id="${symptom.name}" name="${symptom.name}" min="0" max="10" value="0" data-symptom-name="${symptom.name}">
                        <span class="slider-value">0</span>
                    </div>
                `;
            }
            formHtml += `</div>`;
        }
    }
    formHtml += `<div class="form-actions"><button type="submit" class="save-button">Save Log</button></div></form>`;
    mainContent.innerHTML = formHtml;
    attachSliderListeners();
    attachFormSubmitListener(disorder.id);
}
function attachSliderListeners() {
    const sliders = document.querySelectorAll('.symptom-slider input[type="range"]');
    sliders.forEach(slider => {
        const valueSpan = slider.nextElementSibling;
        if (valueSpan) {
            slider.addEventListener('input', () => {
                valueSpan.textContent = slider.value;
            });
        }
    });
}
function attachFormSubmitListener(disorderId) {
    const form = document.getElementById('symptom-form');
    if (!form)
        return;
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const sliders = document.querySelectorAll('.symptom-slider input[type="range"]');
        const symptomsToLog = [];
        sliders.forEach(slider => {
            const severity = parseInt(slider.value, 10);
            if (severity > 0) {
                const symptomName = slider.dataset.symptomName;
                if (symptomName) {
                    symptomsToLog.push({ name: symptomName, severity: severity });
                }
            }
        });
        const entryData = {
            title: `Daily Log - ${new Date().toLocaleDateString()}`,
            content: JSON.stringify({ symptoms: symptomsToLog, frontingAlterId: activeAlterId }),
            date: new Date().toISOString(),
            disorderId: disorderId
        };
        try {
            const response = await fetch(`${API_BASE_URL}/entries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entryData)
            });
            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }
            alert('Log saved successfully!');
            form.reset();
            document.querySelectorAll('.slider-value').forEach(span => {
                if (span)
                    span.textContent = '0';
            });
        }
        catch (error) {
            console.error(error);
            alert('Error: Could not save the log.');
        }
    });
}
// =================================================================
// INITIALIZATION
// =================================================================
function initEventListeners() {
    document.getElementById("open-btn")?.addEventListener("click", openNav);
    document.getElementById("close-btn")?.addEventListener("click", closeNav);
    document.getElementById("overlay")?.addEventListener("click", closeNav);
    document.getElementById("meds-link")?.addEventListener("click", (event) => {
        event.preventDefault();
        displayMedicationLogView();
        closeNav();
    });
    document.getElementById("therapy-link")?.addEventListener("click", (event) => {
        event.preventDefault();
        displayTherapyView();
        closeNav();
    });
    document.getElementById("db-edit-link")?.addEventListener("click", (event) => {
        event.preventDefault();
        displayDbEditingView();
        closeNav();
    });
    document.getElementById("dashboard-link")?.addEventListener("click", (event) => {
        event.preventDefault();
        displayDashboardView();
        closeNav();
    });
}
async function main() {
    console.log("Frontend application initializing...");
    loadChartSettings();
    initEventListeners();
    attachSettingsFormListener();
    // Fetch sidebar data in the background
    Promise.all([
        populateAlterSwitcher(),
        populateDisorderLinks()
    ]);
    // Display the dashboard immediately
    displayDashboardView();
    console.log("Frontend application ready.");
}
main();
//# sourceMappingURL=app.js.map