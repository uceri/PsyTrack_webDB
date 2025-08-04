// Nom de la base de données
const dbName = "PsyTrackDB";
// Version de la base de données
const dbVersion = 1;
// Nom des "Object Stores" (l'équivalent des tables)
const symptomStoreName = "symptoms";
const pathologyStoreName = "pathologies";
let db;
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);
        request.onerror = (event) => {
            console.error("Erreur d'ouverture de la base de données:", event);
            reject("Database error");
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("Base de données ouverte avec succès");
            resolve(db);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            console.log("Mise à jour de la base de données...");
            // Créer l'Object Store pour les symptômes
            if (!db.objectStoreNames.contains(symptomStoreName)) {
                db.createObjectStore(symptomStoreName, { keyPath: "id", autoIncrement: true });
            }
            // Créer l'Object Store pour les pathologies
            if (!db.objectStoreNames.contains(pathologyStoreName)) {
                db.createObjectStore(pathologyStoreName, { keyPath: "id", autoIncrement: true });
            }
        };
    });
}
// Ajoute un symptôme à la base de données
async function addSymptom(symptomData) {
    const db = await openDatabase();
    const transaction = db.transaction(symptomStoreName, "readwrite");
    const store = transaction.objectStore(symptomStoreName);
    return new Promise((resolve, reject) => {
        const request = store.add(symptomData);
        request.onsuccess = () => {
            console.log("Symptôme ajouté avec succès.");
            resolve();
        };
        request.onerror = (event) => {
            console.error("Erreur d'ajout du symptôme:", event);
            reject("Error adding symptom");
        };
    });
}
/**
 * Récupère toutes les pathologies depuis la base de données.
 * @returns {Promise<any[]>} Un tableau contenant toutes les pathologies.
 */
async function getAllPathologies() {
    const db = await openDatabase();
    const transaction = db.transaction(pathologyStoreName, "readonly");
    const store = transaction.objectStore(pathologyStoreName);
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            console.error("Erreur de récupération des pathologies:", event);
            reject("Erreur de récupération des pathologies");
        };
    });
}
async function getAllSymptoms() {
    const db = await openDatabase();
    const transaction = db.transaction(symptomStoreName, "readonly");
    const store = transaction.objectStore(symptomStoreName);
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            console.error("Erreur de récupération des symptômes:", event);
            reject("Error fetching symptoms");
        };
    });
}
export { openDatabase, addSymptom, getAllSymptoms, symptomStoreName, pathologyStoreName, getAllPathologies };
export default openDatabase;
//# sourceMappingURL=database.js.map