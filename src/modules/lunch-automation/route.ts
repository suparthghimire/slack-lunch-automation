import { Router } from "express";
import { LunchController } from "./controller";

const LunchRouter = Router();

LunchRouter.post(
  "/process-and-send",
  LunchController.aggregateAndSendLunchOrder
);

export { LunchRouter };
