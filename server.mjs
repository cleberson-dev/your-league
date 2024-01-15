import { createRequestHandler } from "@remix-run/express";
import express from "express";
import winston from "winston";
import expressWinston from "express-winston";

import * as build from "./build/index.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static("public"));
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
  ),
  meta: true,
  expressFormat: true,
  colorize: false,
}));

app.all("*", createRequestHandler({ build }));

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/...`);
});
