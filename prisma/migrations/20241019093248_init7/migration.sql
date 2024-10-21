-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MOD', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userRole" "UserRole" NOT NULL DEFAULT 'USER';
