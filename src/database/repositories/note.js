import { getDatabase } from "database/database";

const NoteRepository = new Object();

NoteRepository.createEmptyNote = async (idNotebook) => {
    const db = await getDatabase();

    const now = Date.now();

    const result = await db.runAsync(`
        INSERT INTO note (
            id_notebook,
            title,
            content,
            created_at,
            updated_at
        )
        VALUES (?, 'Sin título', '', ?, ?);
    `, [idNotebook, now, now]);

    return result;

}

export default NoteRepository;