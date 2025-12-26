/*
  Warnings:

  - Added the required column `userId` to the `Host` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Host" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "pictureUrl" TEXT,
    "aboutMe" TEXT,
    CONSTRAINT "Host_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Host" ("aboutMe", "email", "id", "name", "password", "phoneNumber", "pictureUrl", "username") SELECT "aboutMe", "email", "id", "name", "password", "phoneNumber", "pictureUrl", "username" FROM "Host";
DROP TABLE "Host";
ALTER TABLE "new_Host" RENAME TO "Host";
CREATE UNIQUE INDEX "Host_userId_key" ON "Host"("userId");
CREATE UNIQUE INDEX "Host_username_key" ON "Host"("username");
CREATE UNIQUE INDEX "Host_email_key" ON "Host"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
