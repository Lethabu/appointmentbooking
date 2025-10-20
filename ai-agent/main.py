import boto3
import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

def get_gemini_api_key():
    secret_name = "GEMINI_API_KEY"
    region_name = os.environ.get("AWS_REGION", "us-east-1")

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except Exception as e:
        # For local development, you can fall back to an environment variable
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise e
        return api_key
    else:
        # Decrypts secret using the associated KMS CMK.
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
            return secret
        else:
            # Handle binary secret if needed
            return None

class ChatRequest(BaseModel):
    query: str
    tenant_id: str = "ccb12b4d-ade6-467d-a614-7c9d198ddc70"

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Get the Gemini API key
        gemini_api_key = get_gemini_api_key()
        
        genai.configure(api_key=gemini_api_key)
        
        # Create the model
        model = genai.GenerativeModel('gemini-pro')
        
        # Generate content
        prompt = f"You are a helpful assistant for a hair salon. The user's query is: {request.query}. Be friendly and helpful."
        response = model.generate_content(prompt)
        
        return {
            "response": response.text,
            "action": "general_response"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
