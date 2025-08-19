from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    query: str
    tenant_id: str = "ccb12b4d-ade6-467d-a614-7c9d198ddc70"

@app.post("/chat")
async def chat(request: ChatRequest):
    # Simple AI responses for booking queries
    query_lower = request.query.lower()
    
    if "book" in query_lower or "appointment" in query_lower:
        return {
            "response": "I can help you book an appointment! What service would you like to book?",
            "action": "booking_intent"
        }
    elif "price" in query_lower or "cost" in query_lower:
        return {
            "response": "Our services range from R180 for wash & blowdry to R450 for full color. Would you like to see our full price list?",
            "action": "pricing_info"
        }
    elif "hours" in query_lower or "open" in query_lower:
        return {
            "response": "We're open Monday to Saturday, 9 AM to 6 PM. Would you like to book an appointment?",
            "action": "hours_info"
        }
    else:
        return {
            "response": f"AI handled: {request.query}. How can I help you with your hair appointment today?",
            "action": "general_response"
        }

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)