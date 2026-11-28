
import * as SQLite from "expo-sqlite";

let db = null;
let dbPromise = null;

export async function getDatabase() {
    if (db) return db;

    if (!dbPromise) {
        dbPromise = (async () => {
            const database = await SQLite.openDatabaseAsync("zuli2.db");

            await database.execAsync(`
                PRAGMA journal_mode = WAL;
                PRAGMA foreign_keys = ON;
            `);

            db = database;
            return database;
        })().catch(error => {
            dbPromise = null;
            throw error;
        });
    }

    return dbPromise;
}
