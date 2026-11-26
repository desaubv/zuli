export default NotebookQueries = {
    insertNotebook: `
        INSERT INTO notebook (name, title, description, color, icon, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW());
    `,
    
}