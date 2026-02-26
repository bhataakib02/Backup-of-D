from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import network
from routes import malware
from routes import network_monitoring

app = FastAPI(title="NeuroSentinel API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(network.router, prefix="/api", tags=["network"])
app.include_router(malware.router, prefix="/api", tags=["malware"])
app.include_router(network_monitoring.router, prefix="/api", tags=["network-monitoring"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)