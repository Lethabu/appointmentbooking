import os
from fastapi import APIRouter, Form, Response
from twilio.twiml.messaging_response import MessagingResponse

# In-memory store for conversation state.
# WARNING: This is for demonstration only. For production, use a persistent
# database like Redis or a SQL database to store conversation states.
conversation_state = {}


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


# Create a router to be included in your main FastAPI application
router = APIRouter()

@router.post("/whatsapp/webhook", response_class=Response)
async def handle_whatsapp_message(
    From: str = Form(...),  # User's WhatsApp number, e.g., "whatsapp:+14155238886"
    Body: str = Form(...)   # The message text from the user
):
    """
    This endpoint receives incoming messages from Twilio for WhatsApp.
    Twilio will POST to this URL every time a user sends a message.
    """
    print(f"Received message from {From}: {Body}")

    user_id = From  # Use the user's number as a unique identifier for state

    # Retrieve or initialize the user's conversation state
    if user_id not in conversation_state:
        conversation_state[user_id] = {"step": "initial"}

    user_state = conversation_state[user_id]

    # Get the AI-generated response based on the conversation flow
    bot_reply = get_ai_response(user_id, Body, user_state)

    # Create a TwiML (Twilio Markup Language) response to send back to the user
    twiml_response = MessagingResponse()
    twiml_response.message(bot_reply)

    # Return the TwiML as an XML response, which Twilio understands
    return Response(content=str(twiml_response), media_type="application/xml")