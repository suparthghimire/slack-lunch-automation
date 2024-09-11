import { SlackRouter } from "@/modules/slack/slack.routes";
import { Router } from "express";

const router = Router();

router.use("/slack", SlackRouter);

export { router };
