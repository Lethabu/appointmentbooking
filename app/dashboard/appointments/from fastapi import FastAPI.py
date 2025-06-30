from fastapi import FastAPI
from datetime import datetime, timezone

app = FastAPI(
    title="AppointmentBookings AI Agent Service",
    description="A dedicated microservice to handle all AI agent interactions.",
    version="1.0.0",
)

@app.get("/", tags=["General"])
def read_root():
    """
    Provides a simple status message for the root endpoint to confirm the service is running.
    """
    return {
        "message": "AppointmentBookings AI Agent Service is running.",
        "docs_url": "/docs",
        "health_check": "/health"
    }

@app.get("/health", tags=["General"])
def health_check():
    """A simple health check endpoint to confirm the service is live and responsive."""
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}

# Your other, more complex agent endpoints like `@app.post("/chat")` will be added below.
# This provides a solid, professional foundation.