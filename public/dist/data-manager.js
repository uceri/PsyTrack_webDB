// Exporter la fonction pour l'utiliser ailleurs
import { openDatabase, symptomStoreName } from './database.js';
const pathologyStoreName = "pathologies";
// Remove top-level await and export a function to get the database
export { openDatabase, symptomStoreName, pathologyStoreName };
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
//# sourceMappingURL=data-manager.js.map