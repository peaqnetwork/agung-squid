module.exports = class transfers1649146021883 {
  name = 'transfers1649146021883'

  async up(db) {
    await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "balance" numeric NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "amount" numeric NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "extrinsic_index" integer NOT NULL, "extrinsic_hash" text NOT NULL, "block_number" integer NOT NULL, "success" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "account"`)
    await db.query(`DROP TABLE "transfer"`)
  }
}
