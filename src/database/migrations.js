
import { getDatabase } from "./database";

export async function initializeDatabase() {
	const db = await getDatabase();

	const initialSQL = (`
        CREATE TABLE IF NOT EXISTS "recurring_date" (
	"id_recurring_date" INTEGER,
	"recurrence" TEXT NOT NULL DEFAULT 'once' CHECK("recurrence" IN once AND daily AND weekly AND monthly AND yearly AND custom),
	"every" INTEGER NOT NULL DEFAULT 1 CHECK("every" >= 1),
	"during" INTEGER DEFAULT NULL CHECK("during" IS null OR "during" >= 1),
	"begins_on" TEXT NOT NULL,
	"ends_on" TEXT DEFAULT NULL,
	"time" TEXT DEFAULT NULL,
	"created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id_recurring_date")
);

CREATE TABLE IF NOT EXISTS "recurring_day" (
	"id_recurring_day" INTEGER,
	"id_recurring_date" INTEGER NOT NULL,
	"day_of_week" INTEGER NOT NULL CHECK("day_of_week" BETWEEN 0 AND 6),
	PRIMARY KEY("id_recurring_day"),
	FOREIGN KEY ("id_recurring_date") REFERENCES "recurring_date"("id_recurring_date")
	ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT "recurring_day_unique_0" UNIQUE ("id_recurring_date", "day_of_week")
);

CREATE TABLE IF NOT EXISTS "recurring_time" (
	"id_recurring_time" INTEGER,
	"id_recurring_date" INTEGER NOT NULL,
	"time" TEXT NOT NULL,
	PRIMARY KEY("id_recurring_time"),
	FOREIGN KEY ("id_recurring_date") REFERENCES "recurring_date"("id_recurring_date")
	ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "calendar_event" (
	"id_calendar_event" INTEGER,
	"kind" TEXT NOT NULL CHECK("kind" IN task AND event AND meeting AND dayoff AND birthday),
	"title" TEXT NOT NULL CHECK([object Object]('title') <= 100),
	"description" TEXT CHECK("description" IS null OR [object Object]('description') <= 255),
	"id_recurring_date" INTEGER NOT NULL,
	PRIMARY KEY("id_calendar_event"),
	FOREIGN KEY ("id_recurring_date") REFERENCES "recurring_date"("id_recurring_date")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "notebook" (
	"id_notebook" INTEGER,
	"title" TEXT NOT NULL CHECK([object Object]('title') <= 255),
	"description" TEXT CHECK("description" IS null OR [object Object]('description') <= 255),
	"icon" TEXT CHECK("icon" IS null OR [object Object]('icon') <= 255),
	"color" TEXT CHECK("color" IS null OR [object Object]('color') <= 10),
	PRIMARY KEY("id_notebook")
);

CREATE TABLE IF NOT EXISTS "note" (
	"id_note" INTEGER,
	"id_notebook" INTEGER NOT NULL,
	"content" TEXT NOT NULL,
	PRIMARY KEY("id_note"),
	FOREIGN KEY ("id_notebook") REFERENCES "notebook"("id_notebook")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

    `);

	const statements = initialSQL
		.split(";")
		.map(sql => sql.trim())
		.filter(sql => sql.length > 0);

	for (const statement of statements) {
		try {
			await db.execAsync(statement + ";");
		} catch (error) {
			console.error("Error en SQL:", statement);
			throw error;
		}
	}

}
