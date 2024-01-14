import { createRequestHandler } from "@remix-run/express";
import express from "express";

import * as build from "./build/index.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static("public"));

app.all("*", createRequestHandler({ build }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
