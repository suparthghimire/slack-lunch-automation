import express from "express";
import cors from "cors";
import { env } from "./lib/env";
import { router } from "./router/router";
import { whatsappClient } from "./modules/whatsapp/init";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", router);

// whatsappClient.initialize();

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
