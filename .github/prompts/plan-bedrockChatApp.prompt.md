## Plan: Bedrock Chat App with Streaming & Model Selection

I will create a React/Python chat application that supports real-time streaming responses and allows for dynamic model selection (e.g., switching between Claude, Llama, etc.).

### Steps
1.  **Scaffold Project**: Create `frontend` (Vite/React) and `backend` (Python/uv) directories.
2.  **Initialize Backend**: Set up the Python environment with `uv`, installing `fastapi`, `uvicorn`, and `boto3`.
3.  **Implement Bedrock Service**: Create a backend service that uses `invoke_model_with_response_stream` and handles different model input schemas (e.g., Claude vs. Llama).
4.  **Create Streaming Endpoint**: Expose a FastAPI endpoint that accepts a `modelId` and streams the Bedrock response back to the client.
5.  **Initialize Frontend**: Generate the React app using Vite and install UI dependencies.
6.  **Build Streaming Chat UI**: Implement a React component that selects a model, sends requests, and processes the incoming stream chunk-by-chunk.

### Further Considerations
1.  **Model Schemas**: Different models (Claude, Titan, Llama) require different JSON payloads. I will implement a simple adapter to handle this.
2.  **CORS**: I will configure CORS on the backend to allow the frontend to connect during development.
3.  **AWS Region**: I will default to `us-east-1` as it has the widest model availability.
