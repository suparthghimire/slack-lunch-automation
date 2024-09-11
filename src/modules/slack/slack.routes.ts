import { Router } from "express";
import { SlackController } from "./slack.controller";

const SlackRouter = Router();

SlackRouter.get("/health", SlackController.health);
SlackRouter.post("/lunch", SlackController.getLunchData);

export { SlackRouter };
