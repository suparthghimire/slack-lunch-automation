import { Request, Response } from "express";
import { SlackService } from "./slack.service";
import { messageHistory } from "./data";
import { env } from "@/lib/env";

export const SlackController = {
  health: (req: Request, res: Response) => {
    return res.status(200).json({
      status: "ok",
      message: "Slack is up and running",
    });
  },

  getLunchData: async (req: Request, res: Response) => {
    type SlackResponse = {
      token: string;
      team_id: string;
      team_domain: string;
      channel_id: string;
      channel_name: string;
      user_id: string;
      user_name: string;
      command: string;
      text: string;
      api_app_id: string;
      is_enterprise_install: string;
      response_url: string;
      trigger_id: string;
    };

    const body: SlackResponse = req.body;

    const response = await SlackService.getAllOpenLunches(body.channel_id);
    const itemList = SlackService.processLunchData(response) ?? [];

    console.log({ itemList: itemList });

    const responseMessage = {
      response_type: "in_channel", // This makes the message visible to everyone in the channel
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Lunch Order Sent* 📞 🍔 \nYour order has been successfully sent to the restaurant!",
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*User:* ${body.user_name}\n*Channel:* <#${body.channel_id}|${body.channel_name}>`,
          },
        },
        {
          type: "section",
          // send item list one by one as a list of orders
          text: {
            type: "mrkdwn",
            text: `Here are the items you ordered:\n${itemList.join("\n")}`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Thank you for using the service!",
          },
        },
      ],
    };

    return res.status(200).json(responseMessage);
  },
};
