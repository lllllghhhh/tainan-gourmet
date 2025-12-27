// web/js/agent.js
const DEFAULT_MODEL = "gpt-oss:20b";

// 走同源 /proxy，避免 CORS，也避免依賴 11435
async function agentListModels() {
  const r = await fetch("/proxy/api/tags", { method: "GET" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function agentSend(userText, model = DEFAULT_MODEL) {
  const payload = {
    model,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "你是專門推薦台南美食的 AI Agent，請用繁體中文回答。" +
          "不要捏造不存在的店名或門牌地址；若不確定門牌，請改提供路名/商圈/地標並明確說明不確定。"
      },
      { role: "user", content: userText }
    ]
  };

  const r = await fetch("/proxy/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
