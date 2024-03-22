const { neon, neonConfig } = require("@neondatabase/serverless");
const secrets = require('../lib/secrets.js')
const {drizzle} = require('drizzle-orm/neon-http')

async function getDbClient() {
  const dburl = await secrets.getDatabaseUrl()
  neonConfig.fetchConnectionCache = true;
  const sql = neon(dburl);
  return sql;
}

async function getDrizzleDbClient() {
  const sql = await getDbClient();
  return drizzle(sql);
}

module.exports.getDbClient = getDbClient
module.exports.getDrizzleDbClient = getDrizzleDbClient