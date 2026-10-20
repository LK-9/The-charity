import handler from '../api/telegram-webhook.mjs';

async function test() {
  // Test 1: GET
  let resStatus, resData;
  const mockResponse1 = {
    status(code) { resStatus = code; return this; },
    send(data) { resData = data; return this; }
  };
  await handler({ method: "GET" }, mockResponse1);
  console.log("Test 1 (GET):", resStatus === 200, resData);

  // Test 2: POST with missing token
  delete process.env.TELEGRAM_BOT_TOKEN;
  await handler({ method: "POST" }, mockResponse1);
  console.log("Test 2 (Missing Token):", resStatus === 500);

  // Test 3: POST with secret check
  process.env.TELEGRAM_BOT_TOKEN = "123456:mock_token";
  process.env.TELEGRAM_WEBHOOK_SECRET = "secret_123";
  await handler({
    method: "POST",
    headers: { "x-telegram-bot-api-secret-token": "wrong_secret" },
    body: {}
  }, mockResponse1);
  console.log("Test 3 (Wrong Secret):", resStatus === 401);

  // Test 4: POST with ignored command (not /start)
  await handler({
    method: "POST",
    headers: { "x-telegram-bot-api-secret-token": "secret_123" },
    body: { message: { chat: { id: 12345 }, text: "hello" } }
  }, mockResponse1);
  console.log("Test 4 (Ignored non-start):", resStatus === 200, resData === "OK");
}

test().catch(console.error);

