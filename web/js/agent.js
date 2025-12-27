// web/js/agent.js
const DEFAULT_MODEL = "gpt-oss:20b";

async function agentListModels() {
  const r = await fetch(`/proxy/api/tags`, { method: "GET" });
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

  const r = await fetch(`/proxy/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
