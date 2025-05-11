-- AlterTable
ALTER TABLE "liked_by" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "user_activity_score" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "notes_received_weekly" INTEGER NOT NULL DEFAULT 0,
    "days_since_last_login" INTEGER NOT NULL DEFAULT 0,
    "post_interactions_monthly" INTEGER NOT NULL DEFAULT 0,
    "activity_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "last_calculated" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activity_score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_config" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "activity_config_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_activity_score_user_id_key" ON "user_activity_score"("user_id");

-- AddForeignKey
ALTER TABLE "user_activity_score" ADD CONSTRAINT "user_activity_score_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
