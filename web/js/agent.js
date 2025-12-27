// web/js/agent.js (整份取代原檔)

// ✅ 走你的 server.py 反向代理路徑（同源，避免 CORS）
const AGENT_BASE = ""; // same-origin
const DEFAULT_MODEL = "gpt-oss:20b";

// 你的 server.py 是 /proxy/{path}
// 所以 tags 要打 /proxy/api/tags
async function agentListModels() {
  const r = await fetch(`${AGENT_BASE}/proxy/api/tags`, { method: "GET" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function agentSend(userText, model = DEFAULT_MODEL) {
  const payload = {
    model,
    stream: false,
    messages: [
      { role: "system", content: "You are a helpful AI agent." },
      { role: "user", content: userText }
    ]
  };

  const r = await fetch(`${AGENT_BASE}/proxy/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
