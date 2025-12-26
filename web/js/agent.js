// js/agent.js (整份取代原檔)
const AGENT_BASE = "/proxy";
const DEFAULT_MODEL = "gpt-oss:20b";

/**
 * 取得可用模型清單（Ollama /api/tags）
 * 回傳格式：{ models: [{ name, ... }, ...] }
 */
async function agentListModels() {
  const r = await fetch(`${AGENT_BASE}/api/tags`, {
    method: "GET",
    mode: "cors",
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`GET /api/tags failed: ${await r.text()}`);
  return r.json();
}

/**
 * 發送聊天（Ollama /api/chat）
 * userText: 使用者輸入
 * model: 模型名稱（例如 gpt-oss:20b）
 */
async function agentSend(userText, model = DEFAULT_MODEL) {
  const payload = {
    model,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "你是台南在地美食推薦 AI。請用繁體中文回答，推薦 3-5 間店，並用條列說明：招牌/價位/適合時段/地區與交通提示。若需求不明，先問 1-2 個問題再推薦。",
      },
      { role: "user", content: userText },
    ],
  };

  const r = await fetch(`${AGENT_BASE}/api/chat`, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.ok) throw new Error(`POST /api/chat failed: ${await r.text()}`);
  return r.json();
}

/**
 * 把模型清單載入到 <select id="model"> 裡
 * - 如果頁面沒有 #model 或不是 select，會直接跳過（不報錯）
 * - 預設會選 DEFAULT_MODEL；不存在就選第一個
 */
async function agentFillModelSelect(selectId = "model") {
  const el = document.getElementById(selectId);
  if (!el || el.tagName.toLowerCase() !== "select") return;

  const data = await agentListModels();
  const names = (data.models || []).map((m) => m.name).filter(Boolean);

  el.innerHTML = "";
  for (const name of names) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    el.appendChild(opt);
  }

  if (names.includes(DEFAULT_MODEL)) el.value = DEFAULT_MODEL;
  else if (names.length > 0) el.value = names[0];
}

/**
 * 讓 HTML 可以直接呼叫（非模組環境）
 */
window.agentListModels = agentListModels;
window.agentSend = agentSend;
window.agentFillModelSelect = agentFillModelSelect;
