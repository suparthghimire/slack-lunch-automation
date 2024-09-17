import axios from "axios";
import { env } from "@/lib/env";

export const WhatsappService = {
  sendMessage: async (phNo: string, message: string) => {
    const baseEndpoint = "https://api.wassenger.com/v1/messages";
    return await axios.post(
      baseEndpoint,
      {
        phone: phNo,
        message: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Token: env.wassengerToken,
        },
      }
    );
  },
};
