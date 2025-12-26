import os
import httpx
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

UPSTREAM = os.environ.get("UPSTREAM", "https://api-gateway.netdb.csie.ncku.edu.tw").rstrip("/")
API_KEY = os.environ.get("OLLAMA_API_KEY", "").strip()

HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8080"))

app = FastAPI()

# 開發階段先全放行，之後可改成只允許你的前端網址
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

HOP_HEADERS = {
    "connection", "keep-alive", "proxy-authenticate", "proxy-authorization",
    "te", "trailers", "transfer-encoding", "upgrade", "host"
}

def clean_headers(headers: dict) -> dict:
    return {k: v for k, v in headers.items() if k.lower() not in HOP_HEADERS}

@app.api_route("/proxy/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
async def proxy(path: str, request: Request):
    if not API_KEY:
        return Response(content="Missing OLLAMA_API_KEY", status_code=500)

    url = f"{UPSTREAM}/{path}"
    params = dict(request.query_params)
    body = await request.body()

    headers = clean_headers(dict(request.headers))
    headers["Authorization"] = f"Bearer {API_KEY}"

    async with httpx.AsyncClient(timeout=120.0) as client:
        r = await client.request(
            method=request.method,
            url=url,
            params=params,
            content=body if body else None,
            headers=headers,
        )

    resp_headers = clean_headers(dict(r.headers))
    return Response(
        content=r.content,
        status_code=r.status_code,
        headers=resp_headers,
        media_type=resp_headers.get("content-type"),
    )

app.mount("/", StaticFiles(directory="web", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
