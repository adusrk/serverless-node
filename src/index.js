const serverless = require("serverless-http");
const express = require("express");
const { getDbClient } = require("./db/clients.js");
const app = express();
const STAGE = process.env.STAGE || "prod";
const crud = require("./db/crud.js");
const validators = require("./db/validators.js");
app.use(express.json());

app.get("/", async (req, res, next) => {
  const sql = await getDbClient();
  // const [results] = await sql`select now()`
  const now = Date.now();
  const [dbNow] = await sql`select now();`;
  const delta = dbNow.now.getTime() - now;
  return res.status(200).json({
    message: "Hello from root!",
    // results: results.now,
    delta: delta,
    stage: STAGE,
  });
});

app.get("/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.get("/leads", async (req, res, next) => {
  const results = await crud.listLeads();
  return res.status(200).json({
    results: results,
  });
});

app.post("/leads", async (req, res, next) => {
  const postData = await req.body;
  // const {email} = data
  const { data, hasError, message } = await validators.validateLead(postData);

  if (hasError === true) {
    return res.status(400).json({
      message: message ? message : "Invalid request",
    });
  } else if (hasError === undefined) {
    return res.status(500).json({
      message: "Server error",
    });
  }

  const result = await crud.newLead(data);
  return res.status(201).json({
    results: result,
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



//  tsx src/cli/putSecrets.js dev postgres://neondb_owner:fiLzx2MQ7npt@ep-black-fog-a14qz9zc.ap-southeast-1.aws.neon.tech/neondb?sslmode=require