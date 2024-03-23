const clients = require("./clients.js");
const schemas = require("./schemas.js");
const {desc, eq} = require('drizzle-orm')

async function newLead({ email }) {
  const db = await clients.getDrizzleDbClient();
  const result = await db
    .insert(schemas.LeadTable)
    .values({ email: email })
    .returning();
  if (result.length === 1) {
    return result[0];
  }
  return result;
}

async function listLeads() {
  const db = await clients.getDrizzleDbClient()
  const results = await db.select().from(schemas.LeadTable).orderBy(desc(schemas.LeadTable.createdAt)).limit(10)
  return results
}

async function getLead(id) {
    const db = await clients.getDrizzleDbClient();
    const result = await db
      .select().from(schemas.LeadTable).orderBy(desc(schemas.LeadTable.createdAt)).limit(10)
      if (result.length === 1) {
        return result[0];
      }
      return null;
}

module.exports.newLead = newLead;
module.exports.listLeads = listLeads;
module.exports.getLead = getLead;

// curl -X POST -H "Content-Type: application/json" -d '{"email": "adnan@gmail.com"}' http://localhost:3000/leads
