# Tainan Gourmet

## 一、專案功能簡介

- 台南美食介紹網站（多分類靜態頁面）
- AI Agent 美食推薦系統
  - 使用者輸入需求（地區 / 時段 / 預算 / 自由描述）
  - AI 產生 3–5 間餐廳推薦
  - 若資訊不足，AI 會先提出澄清問題
- 後端以 FastAPI 實作 proxy

---

## 二、專案目錄結構

```text
tainan-gourmet/
├── README.md
├── requirements.txt
├── server.py                
└── web/
    ├── index.html           
    ├── ai_agent.html       
    ├── *.html               
    ├── css/
    ├── js/
    │   ├── agent.js         
    │   ├── index.js
    │   ├── spin.js
    │   └── ...
    └── image/
```
## 三、專案流程圖

![agent_state_machine](https://hackmd.io/_uploads/BJQaIoAmZl.png)

## 四、安裝與執行步驟

### 1. 下載專案

在目標資料夾執行：

```bash
git clone https://github.com/lllllghhhh/tainan-gourmet.git
cd tainan-gourmet
```
### 2. 安裝 Python 套件
啟用你要使用的 Python 環境執行：

```bash
pip install -r requirements.txt
```
此指令會安裝 server.py 所需的依賴套件，包括 FastAPI、uvicorn 與 httpx。

### 3. 設定環境變數
後端代理需要 LLM 的 API key 才能對上游 API 正常請求。請在執行 server 之前設定：

在 macOS / Linux：

```bash
export OLLAMA_API_KEY="你的_API_KEY"
```
在 Windows PowerShell：

```powershell
setx OLLAMA_API_KEY "你的_API_KEY"
```
### 4. 啟動後端伺服器

在專案根目錄執行：
```
python server.py
```
成功啟動後預設會顯示：
```
Uvicorn running on http://127.0.0.1:8080
```

### 5. 開啟網站

在瀏覽器輸入以下網址：

首頁：
```
http://127.0.0.1:8080/
```
擊點 AI Agent 後即可開始使用

## AI Agent 使用說明

允許使用者自由輸入文字描述需求

於文字輸入欄內寫你的需求，再按下「送出推薦」按鈕。

系統會依照輸入內容與設定的 prompt 規則呼叫 LLM，返回推薦結果。

### 多輪互動說明

當 LLM 判斷目前的資訊不足以提供精準建議時，會先以自然語言提出澄清問題。
此時請在同一個輸入框中回答問題，並再次按下「送出推薦」，系統將重新呼叫 LLM 以提供更精準建議。

