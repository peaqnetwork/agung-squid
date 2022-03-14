module.exports = class Init1647254691693 {
  name = 'Init1647254691693'

  async up(db) {
    await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "balance" numeric NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "account"`)
  }
}
