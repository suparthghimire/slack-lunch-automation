import { Request, Response } from "express";

export const SlackController = {
  health: (req: Request, res: Response) => {
    return res.status(200).json({
      status: "ok",
      message: "Slack is up and running",
    });
  },
};
