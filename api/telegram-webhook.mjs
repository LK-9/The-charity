export default async function handler(request, response) {
  // Simple health check for browser/GET requests
  if (request.method !== "POST") {
    return response.status(200).send("Charity bot webhook is running.");
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN environment variable is missing.");
    return response.status(500).send("Bot token configuration is missing.");
  }

  // Validate webhook secret token if configured
  if (secret) {
    const incomingSecret = request.headers["x-telegram-bot-api-secret-token"];
    if (incomingSecret !== secret) {
      console.warn("Unauthorized webhook request: secret token mismatch.");
      return response.status(401).send("Unauthorized.");
    }
  }

  // Parse update payload safely
  let update = request.body;
  if (typeof update === "string") {
    try {
      update = JSON.parse(update);
    } catch {
      return response.status(400).send("Invalid JSON payload.");
    }
  }

  const message = update?.message;
  const chatId = message?.chat?.id;
  const incomingText = message?.text || "";

  // Process /start command
  if (!chatId || !/^\/start(?:@\w+)?(?:\s|$)/.test(incomingText)) {
    return response.status(200).send("OK");
  }

  const botUsername = process.env.TELEGRAM_BOT_USERNAME || "The_Charity_Bot";
  const webAppUrl =
    process.env.TELEGRAM_WEBAPP_URL || "https://the-charity-lyart.vercel.app";

  const welcomeMessage =
    "Welcome to our Charity Community! ❤️\n\n" +
    "Thank you for connecting with us. Together, we can make a difference " +
    "through kindness, generosity, and support for those in need.\n\n" +
    "Tap the button below to explore our charity platform.";

  // Inline keyboard configured to launch your live Mini App directly inside Telegram
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "Open Charity App",
          web_app: { url: webAppUrl },
        },
      ],
    ],
  };

  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: welcomeMessage,
        reply_markup: keyboard,
      }),
    },
  );

  if (!telegramResponse.ok) {
    const errorDetails = await telegramResponse.text();
    console.error("Telegram sendMessage failed:", errorDetails);
    return response.status(500).send("Could not send welcome message.");
  }

  return response.status(200).send("OK");
}
