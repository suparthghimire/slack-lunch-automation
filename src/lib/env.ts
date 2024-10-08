import dotenv from "dotenv";
dotenv.config();
export const env = {
  lunchBotId: process.env.LUNCH_BOT_ID,
  port: process.env.PORT || 5600,
  slackToken: process.env.SLACK_TOKEN || "",
  wassengerToken: process.env.WASSENGER_TOKEN,
  sendTo: process.env.SEND_TO ?? "",
  whatsappDisabled: process.env.WHATSAPP_DISABLED === "true",
};
