# services/ai-agent/main.py
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List, Dict
import google.generativeai as genai
import openai
import asyncpg
import json
import os
import re
from datetime import datetime, timedelta
import httpx

# Initialize FastAPI app
app = FastAPI(title="Instyle AI Agent - Nia", version="1.0.0")

# Configuration
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
openai.api_key = os.getenv("OPENAI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")
BOOKING_API_URL = os.getenv("BOOKING_API_URL", "http://booking-api:8000")
INSTYLE_TENANT_ID = "ccb12b4d-ade6-467d-a614-7c9d198ddc70"

# Pydantic models
class WhatsAppMessage(BaseModel):
    from_number: str
    message: str
    message_id: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    user_phone: Optional[str] = None
    conversation_id: Optional[str] = None

class BookingIntent(BaseModel):
    intent_type: str  # "book", "reschedule", "cancel", "info"
    service_name: Optional[str] = None
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None
    client_name: Optional[str] = None
    confidence: float = 0.0

# AI Agent for Instyle Hair Boutique
class InstyleAIAgent:
    def __init__(self):
        self.knowledge_base = {
            "services": [
                {"name": "Women's Cut & Blow", "price": 350, "duration": 60, "description": "Professional cut and blow dry"},
                {"name": "Color Treatment", "price": 850, "duration": 120, "description": "Full color treatment with consultation"},
                {"name": "Men's Cut", "price": 250, "duration": 30, "description": "Classic men's haircut"},
                {"name": "Wash & Set", "price": 300, "duration": 45, "description": "Wash and styling service"},
                {"name": "Relaxer Treatment", "price": 650, "duration": 90, "description": "Chemical relaxer with after-care"}
            ],
            "location": "Soshanguve, Pretoria, Gauteng",
            "hours": "Monday to Saturday: 9:00 AM - 5:00 PM",
            "contact": "WhatsApp bookings available",
            "policies": {
                "cancellation": "Cancel at least 2 hours before appointment",
                "payment": "Cash or card accepted",
                "popia": "We protect your personal information according to POPIA"
            }
        }
        
        self.system_prompt = """You are Nia, the AI assistant for Instyle Hair Boutique in Soshanguve, Pretoria. 
        You're friendly, professional, and knowledgeable about hair care. Your main job is to help clients:
        
        1. Book appointments
        2. Get information about services and prices
        3. Reschedule or cancel bookings
        4. Answer questions about hair care
        
        Always be warm and welcoming. Use emojis occasionally but don't overdo it. 
        If someone wants to book, get their name, preferred service, and preferred time.
        Always confirm booking details before processing.
        
        Available services:
        - Women's Cut & Blow: R350 (60 min)
        - Color Treatment: R850 (120 min) 
        - Men's Cut: R250 (30 min)
        - Wash & Set: R300 (45 min)
        - Relaxer Treatment: R650 (90 min)
        
        Hours: Monday-Saturday 9AM-5PM
        Location: Soshanguve, Pretoria
        """

    async def analyze_intent(self, message: str) -> BookingIntent:
        """Analyze user message to determine intent and extract booking details"""
        try:
            model = genai.GenerativeModel('gemini-pro')
            
            prompt = f"""
            Analyze this message and determine the user's intent. Respond with JSON only:
            
            Message: "{message}"
            
            Extract:
            - intent_type: "book", "reschedule", "cancel", "info", "greeting", "other"
            - service_name: if mentioned (exact match from: Women's Cut & Blow, Color Treatment, Men's Cut, Wash & Set, Relaxer Treatment)
            - preferred_date: if mentioned (format as YYYY-MM-DD)
            - preferred_time: if mentioned (format as HH:MM)
            - client_name: if mentioned
            - confidence: 0.0-1.0 how confident you are
            
            JSON format:
            {{
                "intent_type": "book",
                "service_name": "Women's Cut & Blow",
                "preferred_date": "2025-08-15",
                "preferred_time": "14:00",
                "client_name": "Sarah",
                "confidence": 0.9
            }}
            """
            
            response = model.generate_content(prompt)
            intent_data = json.loads(response.text.strip())
            return BookingIntent(**intent_data)
            
        except Exception as e:
            # Fallback intent analysis
            message_lower = message.lower()
            
            if any(word in message_lower for word in ["book", "appointment", "schedule"]):
                return BookingIntent(intent_type="book", confidence=0.7)
            elif any(word in message_lower for word in ["cancel", "cancellation"]):
                return BookingIntent(intent_type="cancel", confidence=0.8)
            elif any(word in message_lower for word in ["reschedule", "change", "move"]):
                return BookingIntent(intent_type="reschedule", confidence=0.8)
            elif any(word in message_lower for word in ["price", "cost", "how much", "services"]):
                return BookingIntent(intent_type="info", confidence=0.8)
            else:
                return BookingIntent(intent_type="other", confidence=0.5)

    async def generate_response(self, message: str, intent: BookingIntent, user_phone: str = None) -> str:
        """Generate contextual response based on intent and message"""
        try:
            model = genai.GenerativeModel('gemini-pro')
            
            # Build context for the AI
            context = f"""
            System: {self.system_prompt}
            
            User message: "{message}"
            Detected intent: {intent.intent_type}
            Confidence: {intent.confidence}
            
            Service details: {json.dumps(self.knowledge_base['services'])}
            Location: {self.knowledge_base['location']}
            Hours: {self.knowledge_base['hours']}
            
            Previous conversation context: Available if needed
            
            Generate a helpful, friendly response. If booking intent detected with sufficient details, 
            guide towards confirmation. If missing info, ask for it politely.
            """
            
            response = model.generate_content(context)
            return response.text.strip()
            
        except Exception as e:
            # Fallback responses
            fallback_responses = {
                "book": "Hi! I'd love to help you book an appointment at Instyle Hair Boutique 💇‍♀️ What service would you like and when would suit you?",
                "info": "Here are our services:\n\n• Women's Cut & Blow - R350\n• Color Treatment - R850\n• Men's Cut - R250\n• Wash & Set - R300\n• Relaxer Treatment - R650\n\nWe're open Mon-Sat 9AM-5PM in Soshanguve, Pretoria. Would you like to book?",
                "greeting": "Hello! Welcome to Instyle Hair Boutique 👋 I'm Nia, your AI assistant. How can I help you today?",
                "other": "I'm here to help with bookings and questions about Instyle Hair Boutique. What would you like to know?"
            }
            
            return fallback_responses.get(intent.intent_type, fallback_responses["other"])

    async def process_booking(self, intent: BookingIntent, user_phone: str) -> Dict:
        """Process booking request through the booking API"""
        if intent.intent_type != "book" or not intent.service_name:
            return {"success": False, "error": "Incomplete booking information"}
        
        # Find service ID (in real implementation, query database)
        service_mapping = {
            "Women's Cut & Blow": "service_1",
            "Color Treatment": "service_2", 
            "Men's Cut": "service_3",
            "Wash & Set": "service_4",
            "Relaxer Treatment": "service_5"
        }
        
        service_id = service_mapping.get(intent.service_name)
        if not service_id:
            return {"success": False, "error": "Service not found"}
        
        # Build booking request
        booking_data = {
            "tenant_id": INSTYLE_TENANT_ID,
            "service_id": service_id,
            "client_name": intent.client_name or "WhatsApp User",
            "client_phone": user_phone,
            "start_time": f"{intent.preferred_date}T{intent.preferred_time}:00Z" if intent.preferred_date and intent.preferred_time else None,
            "consent_popia": True  # Assumed for WhatsApp bookings
        }
        
        # Call booking API
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(f"{BOOKING_API_URL}/book", json=booking_data)
                
                if response.status_code == 201:
                    booking = response.json()
                    return {"success": True, "booking": booking}
                else:
                    error_data = response.json()
                    return {"success": False, "error": error_data.get("detail", "Booking failed")}
                    
        except Exception as e:
            return {"success": False, "error": f"Network error: {str(e)}"}

# Initialize the AI agent
ai_agent = InstyleAIAgent()

# FastAPI endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Instyle AI Agent", "timestamp": datetime.now()}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint for AI conversations"""
    try:
        # Analyze user intent
        intent = await ai_agent.analyze_intent(request.message)
        
        # Generate response
        response = await ai_agent.generate_response(
            request.message, 
            intent, 
            request.user_phone
        )
        
        return {
            "response": response,
            "intent": intent.dict(),
            "timestamp": datetime.now()
        }
        
    except Exception as e:
        return {
            "response": "I'm having trouble right now. Please try again or call us directly!",
            "error": str(e),
            "timestamp": datetime.now()
        }

@app.post("/whatsapp/webhook")
async def whatsapp_webhook(message: WhatsAppMessage, background_tasks: BackgroundTasks):
    """Webhook for incoming WhatsApp messages"""
    try:
        # Analyze intent
        intent = await ai_agent.analyze_intent(message.message)
        
        # Generate response
        response_text = await ai_agent.generate_response(
            message.message,
            intent,
            message.from_number
        )
        
        # If booking intent with sufficient confidence, attempt to process
        if intent.intent_type == "book" and intent.confidence > 0.8:
            booking_result = await ai_agent.process_booking(intent, message.from_number)
            
            if booking_result["success"]:
                booking_id = booking_result["booking"]["id"]
                response_text += f"\n\n✅ Booking confirmed! Reference: {booking_id[:8]}\nSee you soon at Instyle Hair Boutique!"
            else:
                response_text += f"\n\n❌ Booking failed: {booking_result['error']}\nPlease provide more details or try again."
        
        # Log conversation (background task)
        background_tasks.add_task(log_conversation, message.from_number, message.message, response_text, intent)
        
        return {
            "response": response_text,
            "intent_type": intent.intent_type,
            "confidence": intent.confidence,
            "should_book": intent.intent_type == "book" and intent.confidence > 0.8
        }
        
    except Exception as e:
        return {
            "response": "Sorry, I'm having technical difficulties. Please try again later or visit us directly at Instyle Hair Boutique in Soshanguve!",
            "error": str(e)
        }

@app.post("/book-from-chat")
async def book_from_chat(intent: BookingIntent, user_phone: str):
    """Direct booking from chat interface"""
    result = await ai_agent.process_booking(intent, user_phone)
    
    if result["success"]:
        return {
            "success": True,
            "booking_id": result["booking"]["id"],
            "message": "Booking confirmed successfully!"
        }
    else:
        raise HTTPException(status_code=400, detail=result["error"])

async def log_conversation(phone: str, message: str, response: str, intent: BookingIntent):
    """Log conversation for analytics and improvement"""
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        
        await conn.execute("""
            INSERT INTO conversation_logs (
                phone_number, user_message, ai_response, 
                intent_type, confidence, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
        """, phone, message, response, intent.intent_type, intent.confidence, datetime.now())
        
        await conn.close()
        
    except Exception as e:
        print(f"Failed to log conversation: {e}")

# Startup event
@app.on_event("startup")
async def startup_event():
    print("🤖 Instyle AI Agent (Nia) started successfully!")

---

# n8n/workflows/instyle_whatsapp_bot.json
{
  "name": "Instyle WhatsApp Bot - Nia",
  "version": 1,
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "instyle-whatsapp",
        "responseMode": "responseNode"
      },
      "id": "webhook-whatsapp",
      "name": "WhatsApp Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300],
      "webhookId": "instyle-whatsapp"
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "from_number",
              "value": "={{ $json.From }}"
            },
            {
              "name": "message",
              "value": "={{ $json.Body }}"
            },
            {
              "name": "message_id",
              "value": "={{ $json.MessageSid }}"
            }
          ]
        }
      },
      "id": "extract-message",
      "name": "Extract Message Data",
      "type": "n8n-nodes-base.set",
      "position": [460, 300]
    },
    {
      "parameters": {
        "url": "http://ai-agent:8000/whatsapp/webhook",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "from_number",
              "value": "={{ $json.from_number }}"
            },
            {
              "name": "message",
              "value": "={{ $json.message }}"
            },
            {
              "name": "message_id",
              "value": "={{ $json.message_id }}"
            }
          ]
        }
      },
      "id": "call-ai-agent",
      "name": "Call AI Agent",
      "type": "n8n-nodes-base.httpRequest",
      "position": [680, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.intent_type }}",
              "operation": "equal",
              "value2": "book"
            },
            {
              "value1": "={{ $json.confidence }}",
              "operation": "larger",
              "value2": 0.8
            }
          ]
        },
        "combineOperation": "all"
      },
      "id": "check-booking-intent",
      "name": "Check Booking Intent",
      "type": "n8n-nodes-base.if",
      "position": [900, 300]
    },
    {
      "parameters": {
        "accountSid": "={{ $env.TWILIO_ACCOUNT_SID }}",
        "authToken": "={{ $env.TWILIO_AUTH_TOKEN }}",
        "fromPhoneNumber": "whatsapp:+14155238886",
        "toPhoneNumber": "whatsapp:={{ $json.from_number }}",
        "message": "={{ $json.response }}",
        "otherOptions": {}
      },
      "id": "send-whatsapp-response",
      "name": "Send WhatsApp Response",
      "type": "n8n-nodes-base.twilio",
      "position": [1120, 180]
    },
    {
      "parameters": {
        "accountSid": "={{ $env.TWILIO_ACCOUNT_SID }}",
        "authToken": "={{ $env.TWILIO_AUTH_TOKEN }}",
        "fromPhoneNumber": "whatsapp:+14155238886", 
        "toPhoneNumber": "whatsapp:={{ $json.from_number }}",
        "message": "🎉 Great! I've started your booking process. {{ $json.response }}\n\nTo complete your booking, please visit: https://instylehairboutique.co.za/book?phone={{ encodeURI($json.from_number) }}",
        "otherOptions": {}
      },
      "id": "send-booking-followup",
      "name": "Send Booking Follow-up",
      "type": "n8n-nodes-base.twilio",
      "position": [1120, 420]
    },
    {
      "parameters": {
        "url": "http://booking-api:8000/dashboard/ccb12b4d-ade6-467d-a614-7c9d198ddc70",
        "authentication": "none",
        "requestMethod": "GET"
      },
      "id": "update-dashboard",
      "name": "Update Dashboard Stats",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1340, 300]
    },
    {
      "parameters": {
        "respondWith": "text",
        "responseBody": "OK"
      },
      "id": "webhook-response",
      "name": "Webhook Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [1560, 300]
    }
  ],
  "connections": {
    "WhatsApp Webhook": {
      "main": [
        [
          {
            "node": "Extract Message Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract Message Data": {
      "main": [
        [
          {
            "node": "Call AI Agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Call AI Agent": {
      "main": [
        [
          {
            "node": "Check Booking Intent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check Booking Intent": {
      "main": [
        [
          {
            "node": "Send Booking Follow-up",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Send WhatsApp Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send WhatsApp Response": {
      "main": [
        [
          {
            "node": "Update Dashboard Stats",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Booking Follow-up": {
      "main": [
        [
          {
            "node": "Update Dashboard Stats",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Update Dashboard Stats": {
      "main": [
        [
          {
            "node": "Webhook Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "saveExecutionProgress": true,
    "saveManualExecutions": true
  }
}

---

# services/ai-agent/conversation_logs.sql
-- Add conversation logs table for analytics
CREATE TABLE IF NOT EXISTS conversation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number TEXT NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    intent_type TEXT NOT NULL,
    confidence FLOAT NOT NULL,
    booking_created BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversation_logs_phone ON conversation_logs(phone_number);
CREATE INDEX idx_conversation_logs_date ON conversation_logs(created_at);
CREATE INDEX idx_conversation_logs_intent ON conversation_logs(intent_type);