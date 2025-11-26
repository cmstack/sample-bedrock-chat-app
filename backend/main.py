import boto3
import json
import os
from typing import AsyncGenerator, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI()

# CORS - Allow all for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Bedrock Client
# Ensure AWS credentials are set in the environment or ~/.aws/credentials
bedrock_runtime = boto3.client(
    service_name="bedrock-runtime",
    region_name="ca-central-1"
)

class ChatRequest(BaseModel):
    prompt: str
    modelId: str = "us.anthropic.claude-sonnet-4-5-20250929-v1:0"
    max_tokens: int = 1000
    temperature: float = 0.7

async def generate_stream(request: ChatRequest) -> AsyncGenerator[str, None]:
    if not request.modelId:
        request.modelId = "us.anthropic.claude-sonnet-4-5-20250929-v1:0"

    try:
        # Prepare body based on model family
        if "claude" in request.modelId:
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": request.max_tokens,
                "messages": [{"role": "user", "content": request.prompt}],
                "temperature": request.temperature
            })
        elif "llama" in request.modelId:
             # Llama 3 format
             # Note: Llama 3 instruct format usually requires specific prompt formatting, 
             # but for simplicity we pass the raw prompt here. 
             # A real app should format it like <|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n
             body = json.dumps({
                "prompt": request.prompt,
                "max_gen_len": request.max_tokens,
                "temperature": request.temperature,
            })
        else:
            # Fallback for Titan or others
             body = json.dumps({
                "inputText": request.prompt,
                "textGenerationConfig": {
                    "maxTokenCount": request.max_tokens,
                    "temperature": request.temperature,
                }
            })

        response = bedrock_runtime.invoke_model_with_response_stream(
            body=body,
            modelId=request.modelId,
            accept="application/json",
            contentType="application/json"
        )

        stream = response.get('body')
        if stream:
            for event in stream:
                chunk = event.get('chunk')
                if chunk:
                    chunk_json = json.loads(chunk.get('bytes').decode())
                    
                    # Parse different model response structures
                    text_chunk = ""
                    if "claude" in request.modelId:
                        if chunk_json.get('type') == 'content_block_delta':
                             text_chunk = chunk_json['delta'].get('text', '')
                    elif "llama" in request.modelId:
                        text_chunk = chunk_json.get('generation', '')
                    else:
                        # Generic/Titan
                        text_chunk = chunk_json.get('outputText', '')
                    
                    if text_chunk:
                        yield text_chunk

    except Exception as e:
        yield f"Error: {str(e)}"

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    return StreamingResponse(generate_stream(request), media_type="text/plain")

@app.get("/models")
def list_models():
    # Return a list of supported models for the UI
    return [
        {"id": "us.anthropic.claude-sonnet-4-5-20250929-v1:0", "name": "Claude 3.5 Sonnet (v2)"},
        {"id": "anthropic.claude-3-sonnet-20240229-v1:0", "name": "Claude 3 Sonnet"},
        {"id": "anthropic.claude-3-haiku-20240307-v1:0", "name": "Claude 3 Haiku"},
        {"id": "meta.llama3-8b-instruct-v1:0", "name": "Llama 3 8B"},
        {"id": "amazon.titan-text-express-v1", "name": "Titan Text Express"}
    ]
