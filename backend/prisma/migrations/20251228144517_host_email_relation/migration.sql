/*
  Safe migration: hostId → hostEmail
*/

PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

/* 1. Maak nieuwe tabel met hostEmail direct NOT NULL */
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "pricePerNight" REAL NOT NULL,
    "bedroomCount" INTEGER NOT NULL,
    "bathRoomCount" INTEGER NOT NULL,
    "maxGuestCount" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hostEmail" TEXT NOT NULL,
    CONSTRAINT "Property_hostEmail_fkey" FOREIGN KEY ("hostEmail") REFERENCES "Host" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);

/* 2. Kopieer alle bestaande properties + vul hostEmail via subquery */
INSERT INTO "new_Property" (
    "id", "title", "description", "location",
    "pricePerNight", "bedroomCount", "bathRoomCount",
    "maxGuestCount", "rating", "isActive", "hostEmail"
)
SELECT
    p."id",
    p."title",
    p."description",
    p."location",
    p."pricePerNight",
    p."bedroomCount",
    p."bathRoomCount",
    p."maxGuestCount",
    p."rating",
    p."isActive",
    h."email"  -- ⭐ hier vullen we hostEmail
FROM "Property" p
JOIN "Host" h ON h."id" = p."hostId";

/* 3. Drop oude tabel */
DROP TABLE "Property";

/* 4. Hernoem nieuwe tabel */
ALTER TABLE "new_Property" RENAME TO "Property";

/* 5. Maak nieuwe unieke index */
CREATE UNIQUE INDEX "Property_hostEmail_title_key" ON "Property"("hostEmail", "title");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
