
import { getDatabase } from "./database";
import * as SQLite from "expo-sqlite";


export async function initializeDatabase() {
    const db = await getDatabase();

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS "notebook" (
            "id_notebook" INTEGER NOT NULL,
            "title" TEXT NOT NULL,
            "icon" TEXT NOT NULL,
            "color" TEXT NOT NULL,
            "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY("id_notebook")
        );

        CREATE TABLE IF NOT EXISTS "note" (
            "id_note" INTEGER NOT NULL,
            "id_notebook" INTEGER NOT NULL,
            "title" TEXT NOT NULL DEFAULT 'Sin título',
            "content" TEXT NOT NULL,
            "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY("id_note"),
            FOREIGN KEY ("id_notebook") REFERENCES "notebook"("id_notebook")
            ON UPDATE CASCADE ON DELETE CASCADE
        );


    `);
}
