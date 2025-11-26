# Analog AI - AWS Bedrock Chat Application

A full-stack AI chat application with a distinctive Neo-Brutalist design, powered by AWS Bedrock and featuring real-time streaming responses from multiple Large Language Models.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.13-blue)
![React](https://img.shields.io/badge/react-18.2-blue)
![AWS](https://img.shields.io/badge/AWS-Bedrock-orange)

## Features

- **Multi-Model Support**: Interact with various AWS Bedrock models including Claude 3.5 Sonnet v2, Claude 3 Sonnet, Claude 3 Haiku, Llama 3, and Amazon Titan
- **Real-Time Streaming**: Responses stream chunk-by-chunk for an interactive experience
- **Distinctive UI**: Neo-Brutalist design with warm analog aesthetics - bold, memorable, and human-centered
- **Responsive Design**: Fluid layout that works from mobile to desktop
- **Type-Safe**: Full TypeScript implementation in frontend
- **Fast Development**: Hot Module Replacement (HMR) with Vite

## Architecture

```
sample-bedrock-chat-app/
├── backend/              # Python FastAPI server
│   ├── main.py          # API endpoints and Bedrock integration
│   ├── pyproject.toml   # Python dependencies
│   └── .python-version  # Python version specification
├── frontend/            # React + TypeScript UI
│   ├── src/
│   │   ├── components/
│   │   │   └── Chat.tsx # Main chat interface
│   │   ├── App.tsx      # Root component
│   │   ├── main.tsx     # React entry point
│   │   └── index.css    # Design system & global styles
│   ├── package.json     # npm dependencies
│   └── vite.config.ts   # Vite configuration
└── README.md
```

## Technology Stack

### Backend
- **FastAPI** 0.121.3 - Modern async web framework
- **Uvicorn** 0.38.0 - ASGI server
- **boto3** 1.41.1 - AWS SDK for Bedrock access
- **Python** 3.13

### Frontend
- **React** 18.2 + **TypeScript** 5.2
- **Vite** 7.2.4 - Build tool with HMR
- **Tailwind CSS** 4.1.17 - Utility-first CSS
- **Lucide React** 0.554.0 - Icon library

## Prerequisites

- **Python** 3.13 or higher
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **AWS Account** with Bedrock access enabled
- **AWS Credentials** configured locally

## AWS Bedrock Setup

1. Ensure you have AWS credentials configured:
   ```bash
   aws configure
   ```

2. Enable model access in AWS Bedrock console:
   - Navigate to AWS Bedrock in `ca-central-1` region
   - Go to "Model access" in the left sidebar
   - Request access to desired models (Claude, Llama, Titan)

3. Verify IAM permissions include:
   - `bedrock:InvokeModel`
   - `bedrock:InvokeModelWithResponseStream`

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies using uv (recommended) or pip:
   ```bash
   # Using uv (faster)
   pip install uv
   uv pip install -e .

   # Or using pip
   pip install -e .
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Start the Backend Server

1. From the `backend/` directory:
   ```bash
   uvicorn main:app --reload
   ```

2. The API will be available at `http://localhost:8000`

3. API documentation available at:
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Start the Frontend Development Server

1. From the `frontend/` directory:
   ```bash
   npm run dev
   ```

2. The application will open at `http://localhost:5173`

### Using the Application

1. Open `http://localhost:5173` in your browser
2. Type your message in the input field
3. Press "Send" or hit Enter
4. Watch the AI response stream in real-time

## API Endpoints

### `POST /chat`

Send a message and receive a streaming response.

**Request Body:**
```json
{
  "prompt": "Your message here",
  "modelId": "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
  "max_tokens": 1000,
  "temperature": 0.7
}
```

**Response:** Streaming text/plain content

### `GET /models`

Retrieve list of available models (if endpoint is implemented).

## Supported Models

The application supports the following AWS Bedrock models:

- **Claude 3.5 Sonnet v2** (default): `us.anthropic.claude-sonnet-4-5-20250929-v1:0`
- **Claude 3 Sonnet**: `anthropic.claude-3-sonnet-20240229-v1:0`
- **Claude 3 Haiku**: `anthropic.claude-3-haiku-20240307-v1:0`
- **Llama 3 8B Instruct**: `meta.llama3-8b-instruct-v1:0`
- **Amazon Titan Text Express**: `amazon.titan-text-express-v1`

To change the model, modify the `selectedModel` variable in `/frontend/src/components/Chat.tsx`.

## Design Philosophy

This application features **"Analog AI"** - a distinctive Neo-Brutalist design with warm analog touches:

- **Warm Color Palette**: Terracotta, sage green, cream, and charcoal instead of typical tech blues
- **Bold Typography**: Outfit (display), Crimson Pro (body), JetBrains Mono (technical)
- **Brutalist Elements**: Chunky borders, offset shadows, geometric shapes
- **Organic Animations**: Floating elements, sliding messages with rotation
- **Paper Texture**: Subtle grain overlay for warmth

This design intentionally breaks from generic AI chat interfaces to create a memorable, human-centered experience.

## Configuration

### Backend Configuration

**Region**: The backend is configured for `ca-central-1`. To change:

```python
# In backend/main.py
bedrock_runtime = boto3.client(
    service_name='bedrock-runtime',
    region_name='your-region'  # Change this
)
```

**CORS**: Currently allows all origins for development. Update for production:

```python
# In backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.com"],  # Restrict origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Frontend Configuration

**API Endpoint**: Update the backend URL if deployed:

```typescript
// In frontend/src/components/Chat.tsx
const response = await fetch('https://your-api.com/chat', {
  // ...
});
```

## Development

### Backend Development

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Linting

```bash
cd frontend
npm run lint
```

### Build for Production

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`.

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`
- **Solution**: Ensure virtual environment is activated and dependencies are installed

**Problem**: `botocore.exceptions.NoCredentialsError`
- **Solution**: Configure AWS credentials with `aws configure`

**Problem**: `AccessDeniedException` from Bedrock
- **Solution**: Enable model access in AWS Bedrock console and verify IAM permissions

### Frontend Issues

**Problem**: CORS errors in browser console
- **Solution**: Ensure backend is running on `http://localhost:8000`

**Problem**: "Failed to get response" error
- **Solution**: Check that backend is running and AWS credentials are valid

**Problem**: Fonts not loading
- **Solution**: Check internet connection (fonts load from Google Fonts CDN)

## Environment Variables (Optional)

Create a `.env` file in the backend directory for configuration:

```env
AWS_REGION=ca-central-1
AWS_PROFILE=default
MAX_TOKENS=1000
TEMPERATURE=0.7
```

## Security Considerations

- **API Keys**: Never commit AWS credentials to version control
- **CORS**: Restrict allowed origins in production
- **Input Validation**: Backend validates all incoming requests
- **Rate Limiting**: Consider adding rate limiting for production use
- **Authentication**: Add user authentication for production deployment

## Future Enhancements

- [ ] Conversation persistence with database
- [ ] User authentication and session management
- [ ] Model selection UI in frontend
- [ ] Message history export
- [ ] Dark/light theme toggle
- [ ] Markdown rendering for AI responses
- [ ] Code syntax highlighting
- [ ] File upload support
- [ ] Multi-user support
- [ ] Conversation branching
- [ ] Token usage tracking

## License

This is a sample application for educational and demonstration purposes.

## Contributing

This is a sample project. Feel free to fork and modify for your own use.

## Support

For issues related to:
- **AWS Bedrock**: Consult [AWS Bedrock documentation](https://docs.aws.amazon.com/bedrock/)
- **FastAPI**: See [FastAPI documentation](https://fastapi.tiangolo.com/)
- **React**: See [React documentation](https://react.dev/)

## Acknowledgments

- Built with AWS Bedrock for AI capabilities
- Designed with a focus on distinctive, memorable user experience
- Inspired by Neo-Brutalist and analog design movements
