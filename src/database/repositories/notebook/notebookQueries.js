export default {
    insertNotebook: `
        INSERT INTO "notebook" (title, color, icon, created_at, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `,

    getNotebooks: `
        SELECT * FROM notebook;
    `,

    deleteNotebook: `
        DELETE FROM notebooks WHERE id_notebook = ?
    `,

    updateNotebook: `UPDATE notebooks
        SET title = ?, color = ?, icon = ?
        WHERE id_notebook = ?
    `,
}