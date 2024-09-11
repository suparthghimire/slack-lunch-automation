import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { env } from "./lib/env";

dotenv.config();

const app = express();
app.use(cors());

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
