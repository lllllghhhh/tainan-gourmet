// js/agent.js
const AGENT_BASE = "http://127.0.0.1:11435";

async function agentListModels() {
  const r = await fetch(`${AGENT_BASE}/api/tags`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function agentSend(userText, model) {
  const payload = {
    model,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "你是專門推薦台南美食的 AI Agent，請避免捏造地址，若不確定請誠實說明。"
      },
      {
        role: "user",
        content: userText
      }
    ]
  };

  const r = await fetch(`${AGENT_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
