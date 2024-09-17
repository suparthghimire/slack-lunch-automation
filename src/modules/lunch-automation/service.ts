import { ConversationsHistoryResponse, WebClient } from "@slack/web-api";
import { env } from "@/lib/env";
import { DescriptionElement } from "@slack/web-api/dist/types/response/ChatPostMessageResponse";
import fs from "fs";
const slackClient = new WebClient(env.slackToken);

export const LunchService = {
  getAllOpenLunchesSentByLunchBot: async (channelId: string) => {
    const response = await slackClient.conversations.history({
      channel: channelId,
    });

    return response;
  },

  normalizeWords: (text: string) => {
    return text.toLowerCase().split(" ").sort().join(" ").trim();
  },

  aggregateLunchOrders: (orders: string[]) => {
    const itemMap: Record<string, number> = {};

    orders.forEach((item) => {
      const [qty, combinedItems] = item.split("×").map((item) => item.trim());
      const individualItems = combinedItems
        .split("+")
        .map((item) => item.trim());

      individualItems.forEach((item) => {
        const qtyNum = parseInt(qty, 10);
        const normalizedItem = LunchService.normalizeWords(item);
        if (itemMap[normalizedItem]) {
          itemMap[normalizedItem] += qtyNum;
        } else {
          itemMap[normalizedItem] = qtyNum;
        }
      });
    });

    const result: string[] = [];
    for (const [item, qty] of Object.entries(itemMap)) {
      result.push(`${qty} × ${item}`);
    }

    return result;
  },

  processLunchData: (response: ConversationsHistoryResponse) => {
    const messages = response.messages ?? [];
    const messagesByBot = messages
      .filter(
        (msg) => msg.bot_id === env.lunchBotId && msg.subtype !== "bot_message"
      )
      .slice(0, 3);
    // save to json file
    fs.writeFileSync("messages.json", JSON.stringify(messagesByBot));

    console.log({ messages: JSON.stringify(messagesByBot) });

    const lastMsgByBot = messagesByBot
      .filter((msg) => msg.bot_id === env.lunchBotId)
      .find((msg) => {
        return msg.text?.toLowerCase()?.includes("paid by") === false;
      });

    if (!lastMsgByBot) return null;

    console.log({ lastMsgByBot: JSON.stringify(lastMsgByBot) });

    const blocks = lastMsgByBot.blocks
      ?.filter(
        (block) => block.type === "section" && block.text?.text?.includes("×")
      )
      .map((block) => {
        const itemText = block.text?.text?.split("\n")[0];
        return itemText?.split("*")[1];
      })
      .filter(Boolean) as string[];

    return LunchService.aggregateLunchOrders(blocks);
  },
};