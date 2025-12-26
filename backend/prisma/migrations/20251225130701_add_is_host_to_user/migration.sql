-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "pictureUrl" TEXT,
    "aboutMe" TEXT,
    "isHost" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("aboutMe", "email", "id", "name", "password", "phoneNumber", "pictureUrl", "username") SELECT "aboutMe", "email", "id", "name", "password", "phoneNumber", "pictureUrl", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
