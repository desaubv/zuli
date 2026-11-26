
import { getDatabase } from "./database";

export async function initializeDatabase() {
    const db = await getDatabase();

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS "notebook" (
            "id_notebook" INTEGER NOT NULL,
            "title" TEXT NOT NULL,
            "description" TEXT,
            "icon" TEXT NOT NULL,
            "color" TEXT NOT NULL,
            "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY("id_notebook")
        );
    `);
}
