const serverless = require("serverless-http");
const express = require("express");
const { neon, neonConfig } = require("@neondatabase/serverless");
const AWS = require("aws-sdk");

const AWS_REGION = "ap-southeast-1";
const STAGE = process.env.STAGE || "prod";
const app = express();

const ssm = new AWS.SSM({ region: AWS_REGION });
const DATABASE_URL_SSM_PARAM = `/serverless-nodejs-api/${STAGE}/database-url`;

async function dbClient() {
  const paramStoreData = await ssm
    .getParameter({
      Name: DATABASE_URL_SSM_PARAM,
      WithDecryption: true,
    })
    .promise();
  neonConfig.fetchConnectionCache = true;
  const sql = neon(paramStoreData.Parameter.Value);
  return sql;
}

app.get("/", async (req, res, next) => {
  const sql = await dbClient();
  // const [results] = await sql`select now()`
  const [dbNow] = await sql`select now();`;
  const delta = (Date.now() - dbNow.now.getTime()) / 1000;
  return res.status(200).json({
    message: "Hello from root!",
    // results: results.now,
    delta: delta,
  });
});

app.get("/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

//Server-full
// app.listen(3000, () => {
//   console.log("Your server is now running");
// })

module.exports.handler = serverless(app);
