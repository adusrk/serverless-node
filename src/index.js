const serverless = require("serverless-http");
const express = require("express");
const {getDbClient} = require("./db/clients.js")
const app = express();

app.get("/", async (req, res, next) => {
  const sql = await getDbClient();
  // const [results] = await sql`select now()`
  const now = Date.now()
  const [dbNow] = await sql`select now();`;
  const delta = (dbNow.now.getTime() - now);
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
