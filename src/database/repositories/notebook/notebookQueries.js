export default {
    insertNotebook: `
        INSERT INTO notebook (name, title, description, color, icon, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `,

    getNotebooks: `
        SELECT * FROM notebook;
    `
    
}