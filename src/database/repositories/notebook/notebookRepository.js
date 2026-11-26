
import { getDatabase } from "../database";
import { notebookQueries } from "./notebookQueries";

const notebookRepository = new Object();

notebookRepository.createNotebook = async (title, description, icon, color) => {
    const db = await getDatabase();

    const result = await db.runAsync(
        notebookQueries.insertNotebook,
        [title, description, icon, color]
    );

    return result;
}

// export async function createMedication(name, description = null) {
//     const db = await getDatabase();

//     const result = await db.runAsync(
//         `INSERT INTO medication (name, description)
//          VALUES (?, ?)`,
//         [name, description]
//     );

//     return result.lastInsertRowId;
// }

// export async function getMedications() {
//     const db = await getDatabase();

//     return await db.getAllAsync(
//         "SELECT * FROM medication ORDER BY id_medication DESC"
//     );
// }

// export async function getMedicationById(id) {
//     const db = await getDatabase();

//     return await db.getFirstAsync(
//         "SELECT * FROM medication WHERE id_medication = ?",
//         [id]
//     );
// }

// export async function updateMedication(id, name, description) {
//     const db = await getDatabase();

//     return await db.runAsync(
//         `UPDATE medication
//          SET name = ?, description = ?
//          WHERE id_medication = ?`,
//         [name, description, id]
//     );
// }

// export async function deleteMedication(id) {
//     const db = await getDatabase();

//     return await db.runAsync(
//         "DELETE FROM medication WHERE id_medication = ?",
//         [id]
//     );
// }

export default notebookRepository;