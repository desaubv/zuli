import { getDatabase } from "database/database";

const NotebookRepository = new Object();

NotebookRepository.insertNotebook = async (title, color, icon) => {
    const db = await getDatabase();
    const now = Date.now();
    const result = await db.runAsync(
        `INSERT INTO "notebook" (title, color, icon, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?);`,
        [title, color, icon, now, now]
    );

    return result;
}

NotebookRepository.getNotebooks = async () => {
    const db = await getDatabase();
    const result = await db.getAllAsync(`
        SELECT
            notebook.*,
            (
                SELECT json_group_array(
                    json_object(
                        'id_note', note.id_note,
                        'title', note.title,
                        'content', note.content,
                        'created_at', note.created_at,
                        'updated_at', note.updated_at
                    )
                )
                FROM note
                WHERE note.id_notebook = notebook.id_notebook
            ) AS notes
        FROM notebook;
    `);

    return result;
}

NotebookRepository.deleteNotebook = async (id) => {
    const db = await getDatabase();
    const result = await db.runAsync(`DELETE FROM notebook WHERE id_notebook = ?`, [id]);

    return result;
}

NotebookRepository.updateNotebook = async (id, title, color, icon) => {
    const db = await getDatabase();

    const now = Date.now();
    const result = await db.runAsync(
        `UPDATE notebook
        SET title = ?, color = ?, icon = ?, updated_at = ?
        WHERE id_notebook = ?`,
        [title, color, icon, now, id]
    );

    return result;
}
export default NotebookRepository;