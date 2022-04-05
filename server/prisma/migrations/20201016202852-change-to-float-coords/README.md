# Migration `20201016202852-change-to-float-coords`

This migration has been generated at 10/16/2020, 10:28:52 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER,
    "name" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "struct" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "isArchived" BOOLEAN NOT NULL,

    FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Group" ("id", "createdAt", "ownerId", "name", "img", "struct", "x", "y", "isArchived") SELECT "id", "createdAt", "ownerId", "name", "img", "struct", "x", "y", "isArchived" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201012215824-second..20201016202852-change-to-float-coords
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "sqlite"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -22,10 +22,10 @@
   owner      User?      @relation(fields: [ownerId], references: [id])
   name       String
   img        String
   struct     String
-  x          Int
-  y          Int
+  x          Float
+  y          Float
   isArchived Boolean
   Compound   Compound[]
 }
```


