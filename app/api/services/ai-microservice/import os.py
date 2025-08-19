import os
import requests
from fastapi import APIRouter, Body, Response
from pydantic import BaseModel

# In-memory store for conversation state.
# WARNING: This is for demonstration only. For production, use a persistent
# database like Redis or a SQL database to store conversation states.
conversation_state = {}

AISENSY_API_URL = os.environ.get("AISENSY_API_URL")
AISENSY_API_KEY = os.environ.get("AISENSY_API_KEY")

def get_ai_response(user_id: str, message: str, state: dict) -> str:
    """
    Simulates calling an LLM or a business logic engine to get a response.
    This function manages the conversation flow based on the user's state.
    """
    lower_message = message.lower().strip()
    current_step = state.get("step", "initial")

    if current_step == "initial":
        if "book" in lower_message or "appointment" in lower_message:
            state["step"] = "ask_service"
            return "Of course! I can help with that. What service are you interested in booking? (e.g., Therapy, Coaching, Salon)"
        else:
            return "Hello! You can ask me to 'book an appointment' or ask other questions about our services."

    elif current_step == "ask_service":
        state["service"] = message
        state["step"] = "ask_time"
        return f"Great, you've selected '{message}'. What day and time works best for you?"

    elif current_step == "ask_time":
        state["time"] = message
        state["step"] = "confirm"
        service = state.get('service', 'a service')
        # In a real app, you would call your scheduling system here to check availability.
        return f"Perfect. Just to confirm, you want to book '{service}' for '{message}'. Is that correct? (Yes/No)"

    elif current_step == "confirm":
        if "yes" in lower_message:
            # In a real app, you would trigger the actual booking in your system here.
            # e.g., booking_system.create_appointment(state)
            # Then, reset the state for the next conversation.
            state.clear()
            state["step"] = "initial"
            return "Excellent! Your appointment is confirmed. You will receive a confirmation message shortly. Is there anything else I can help with?"
        else:
            state.clear()
            state["step"] = "initial"
            return "No problem. Let's start over. How can I help you today?"

    return "I'm sorry, I didn't understand that. Can you please rephrase?"


def send_aisensy_message(to: str, message: str):
    """
    Sends a message using the Aisensy API.
    """
    if not AISENSY_API_URL or not AISENSY_API_KEY:
        print("Aisensy API URL or API Key not configured.")
        return

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AISENSY_API_KEY}"
    }
    payload = {
        "to": to,
        "message": message
    }
    try:
        response = requests.post(f"{AISENSY_API_URL}/messages", headers=headers, json=payload)
        response.raise_for_status()
        print(f"Message sent to {to}: {message}")
    except requests.exceptions.RequestException as e:
        print(f"Error sending message to {to}: {e}")


# Create a router to be included in your main FastAPI application
router = APIRouter()

class AisensyWebhook(BaseModel):
    topic: str
    data: dict

@router.post("/whatsapp/webhook", status_code=204)
async def handle_whatsapp_message(payload: AisensyWebhook = Body(...)):
    """
    This endpoint receives incoming messages from Aisensy for WhatsApp.
    """
    print(f"Received webhook from Aisensy: {payload}")

    if payload.topic in ["message.created", "message.sender.user"]:
        # Assuming the payload.data contains sender and message info
        # This part might need adjustment based on the actual payload structure
        sender_info = payload.data.get("sender", {})
        user_id = sender_info.get("id") # or "phone" or "number"
        message_info = payload.data.get("message", {})
        message_body = message_info.get("text")

        if not user_id or not message_body:
            print("Could not extract user_id or message_body from payload.")
            return Response(status_code=400)

        # Retrieve or initialize the user's conversation state
        if user_id not in conversation_state:
            conversation_state[user_id] = {"step": "initial"}

        user_state = conversation_state[user_id]

        # Get the AI-generated response based on the conversation flow
        bot_reply = get_ai_response(user_id, message_body, user_state)

        # Send the reply using Aisensy
        send_aisensy_message(user_id, bot_reply)

    return Response(status_code=204)
