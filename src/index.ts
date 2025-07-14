import "dotenv/config";

import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import AIAgent from "./api/matra";
import telegramifyMarkdown from "telegramify-markdown";
import { GetMemoryThreadMessagesResponse } from "@mastra/client-js";

const bot = new Telegraf(String(process.env.TELEGRAM_BOT_TOKEN));
const agentId = "costumerServiceAgent";

function countMessagesFromToday(messages: any[]) {
  const today = new Date();
  const todayDateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

  return messages.filter((message) => {
    const messageDateStr =
      new Date(message.createdAt).toISOString().split("T")[0];
    return messageDateStr === todayDateStr && message.role === "user";
  }).length;
}

const rateLimit = (conversation: GetMemoryThreadMessagesResponse) => {
  return countMessagesFromToday(conversation.uiMessages) > 5;
};

bot.command("quit", async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});

bot.on(message("text"), async (ctx) => {
  const threadId = String(ctx.message.chat.id);
  try {
    const thread = AIAgent.getMemoryThread(threadId, agentId);
    const history = await thread.getMessages();
    //     if (rateLimit(history)) {
    //       return await ctx.reply(
    //         `متاسفانه در به ۵ سوال روز قادر به پاسخگویی هستیم.
    // برای اطلاعات بیشتر به سایت بازرگ مراجعه کنید.
    // https://bazorg.com/`,
    //       );
    //     }
  } catch (error) {
    console.error("Initialization error:", error);
    if (error instanceof Error) {
      if (error.message.includes("status: 401")) {
        console.log("Token Probel");
        return await ctx.reply(`Internal Server Error`);
      } else if (error.message.includes("status: 404")) {
        await AIAgent.createMemoryThread({
          agentId,
          resourceId: agentId,
          threadId,
        });
      }
    } else {
      console.error("Unexpected error:", error);
    }
  }

  const agent = AIAgent.getAgent(agentId);
  await ctx.sendChatAction("typing");

  const resp = await agent.generate({
    messages: [{
      role: "user",
      content: ctx.message.text,
    }],
    resourceId: agentId,
    runId: agentId,
    temperature: 0.5,
    threadId: threadId,
    topP: 1,
    maxSteps: 20,
    maxRetries: 5,
  });

  console.log(resp);
  if (resp.text === "") {
    return await ctx.reply(
      `مشکلی برای هوض‌مصنوعی پیش آمده.`,
    );
  }

  await ctx.replyWithMarkdownV2(
    telegramifyMarkdown(resp.text, "remove"),
    {
      parse_mode: "MarkdownV2",
    },
  );
});

bot.launch(() => {
  console.log("bot started succesfully");
});
// bot.launch({
//   webhook: {
//     // Public domain for webhook; e.g.: example.com
//     domain: String(process.env.TELEGRAM_BOT_WEBHOOK_DOMAIN),

//     // Port to listen on; e.g.: 8000
//     port: Number(process.env.TELEGRAM_BOT_PORT) || 8000,

//     // Optional path to listen for.
//     // `bot.secretPathComponent()` will be used by default
//     // path: webhookPath,

//     // Optional secret to be sent back in a header for security.
//     // e.g.: `crypto.randomBytes(64).toString("hex")`
//     secretToken: process.env.TELEGRAM_BOT_SECRET,
//   },
// });
bot.catch((err, ctx) => {
  console.log(err);
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
