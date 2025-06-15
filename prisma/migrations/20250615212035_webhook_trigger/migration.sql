-- CreateTable
CREATE TABLE "User" (
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "FullName" TEXT,
    "username" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("clerkId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
