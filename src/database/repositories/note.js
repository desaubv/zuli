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
        VALUES (?, '', '', ?, ?);
    `, [idNotebook, now, now]);

    return result;
}

NoteRepository.deleteNote = async (id) => {
    const db = await getDatabase();
    const result = await db.runAsync(`DELETE FROM note WHERE id_note = ?`, [id]);

    return result;
}

NoteRepository.getNoteById = async (id) => {
    const db = await getDatabase();
    const result = await db.getFirstAsync(`SELECT * FROM note WHERE id_note = ?`, [id]);

    return result;
}

NoteRepository.updateNoteById = async (id, title, content) => {
    const db = await getDatabase();
    const now = Date.now();
    const result = await db.runAsync(
        `UPDATE note
        SET title = ?, content = ?, updated_at = ?
        WHERE id_note = ?`,
        [title, content, now, id]
    );

    return result;
}

export default NoteRepository;