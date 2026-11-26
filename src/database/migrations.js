
import { getDatabase } from "./database";

export async function initializeDatabase() {
    const db = await getDatabase();

    await db.execAsync(`
    `);
}
