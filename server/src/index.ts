import cors from "cors";
import express from "express";
import { mcp } from "./middleware.js";
import server from "./server.js";

const app = express();

app.use(express.json());

const nodeEnv = process.env.NODE_ENV || "development";

if (nodeEnv !== "production") {
  const { devtoolsStaticServer } = await import("@skybridge/devtools");
  app.use(await devtoolsStaticServer());
}

app.use(cors());
app.use(mcp(server));

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
