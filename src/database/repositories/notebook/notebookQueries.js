export const notebookQueries = {
    insertNotebook: `INSERT INTO notebook (title, description, icon, color)
                    VALUES (?, ?, ?, ?)`
}
