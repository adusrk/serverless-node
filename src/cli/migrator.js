const secrets = require("../lib/secrets.js");
const schema = require("../db/schemas.js");
const {migrate} = require('drizzle-orm/postgres-js/migrator')
require("dotenv").config();
const { Pool, neonConfig } = require("@neondatabase/serverless");
const ws = require("ws");
const {drizzle} = require('drizzle-orm/neon-serverless')

async function performMigration() {
  const dbUrl = await secrets.getDatabaseUrl();
  if(!dbUrl){
    return
  }
  neonConfig.webSocketConstructor = ws;

  const pool = new Pool({ connectionString: dbUrl });
  pool.on("error", (err) => console.error(err));
  // ...

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
        const db = await drizzle(client, {schema})
        await migrate(db, {migrationsFolder: 'src/migrations'})
    await client.query("COMMIT");

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  // ...
  await pool.end();
}

if (require.main === module) {
  performMigration()
    .then((val) => {
        console.log("Migration done");
      process.exit(0);
    })
    .catch((err) => {
      console.log("Migration error" + err);
      process.exit(1);
    });
}
