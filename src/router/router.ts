import { LunchRouter } from "@/modules/lunch-automation/route";
import { Router } from "express";

const router = Router();

router.use("/lunch", LunchRouter);

export { router };
