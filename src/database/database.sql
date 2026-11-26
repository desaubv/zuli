CREATE TABLE IF NOT EXISTS "notebook" (
	"id_notebook" INTEGER NOT NULL,
	"title" TEXT NOT NULL,
	"description" TEXT,
	"icon" TEXT NOT NULL,
	"color" TEXT NOT NULL,
	"created_at" DATETIME NOT NULL DEFAULT NOW(),
	"updated_at" DATETIME NOT NULL,
	PRIMARY KEY("id_notebook")
);

CREATE TABLE IF NOT EXISTS "note" (
	"id_note" INTEGER NOT NULL,
	"id_notebook" INTEGER NOT NULL,
	"content" TEXT NOT NULL,
	"created_at" DATETIME NOT NULL DEFAULT NOW(),
	"updated_at" DATETIME NOT NULL,
	PRIMARY KEY("id_note"),
	FOREIGN KEY ("id_notebook") REFERENCES "notebook"("id_notebook")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);
