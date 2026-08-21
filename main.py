from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CampusSafe AI",
    description="Multimodal Campus Emergency Early-Warning & Evacuation Router",
    version="1.0.0"
)

# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "project": "CampusSafe AI",
        "status": "ONLINE",
        "message": "Emergency system is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "CampusSafe AI backend"
    }


@app.post("/test-emergency")
def test_emergency():
    return {
        "status": "ALERT",
        "message": "Emergency test successful",
        "instruction": "Please remain calm and follow the nearest safe evacuation route."
    }