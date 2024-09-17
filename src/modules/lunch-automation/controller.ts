import { Request, Response } from "express";
import { LunchService } from "./service";
import { WhatsappService } from "../whatsapp/service";
import { env } from "@/lib/env";

export const LunchController = {
  aggregateAndSendLunchOrder: async (req: Request, res: Response) => {
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

    const response = await LunchService.getAllOpenLunchesSentByLunchBot(
      body.channel_id
    );
    const itemList = LunchService.processLunchData(response) ?? [];

    const date = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
    }).format(new Date());

    const msg = await WhatsappService.sendMessage(
      env.sendTo,
      `Lunch Order from Naamche for ${date} \n ${itemList.join("\n")}`
    );

    console.log({ msg });

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
