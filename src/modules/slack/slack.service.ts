import { ConversationsHistoryResponse, WebClient } from "@slack/web-api";
import { env } from "@/lib/env";
import { DescriptionElement } from "@slack/web-api/dist/types/response/ChatPostMessageResponse";

const slackClient = new WebClient(env.slackToken);

export const SlackService = {
  getAllOpenLunches: async (channelId: string) => {
    console.log({ st: env.slackToken });
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
        const normalizedItem = SlackService.normalizeWords(item);
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

    const lastMsgByBot = messages
      .filter((msg) => msg.bot_id === env.lunchBotId)
      .at(0);

    if (!lastMsgByBot) return null;

    const blocks = lastMsgByBot.blocks
      ?.filter((block) => block.type === "section")
      .map((bl) => {
        if ("text" in bl) return bl.text;
      })
      .filter((item) => {
        return item && item.text && item.text.includes("×");
      })
      .map((item) => {
        if (item) {
          const itemTxt = item.text?.split("\n")[0];
          const textBetnTwoStars = itemTxt?.split("*")[1];

          return textBetnTwoStars;
        }
      })
      .filter(Boolean) as string[];

    return SlackService.aggregateLunchOrders(blocks);
  },
};
