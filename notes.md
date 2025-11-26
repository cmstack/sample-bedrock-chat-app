Overview

  This is a full-stack AI chat application that integrates with AWS Bedrock to provide conversational AI
  through a modern web interface with real-time streaming responses.

  Architecture

  Backend (/backend/)
  - Python FastAPI server with streaming support
  - AWS Bedrock integration using boto3
  - Supports 5+ AI models (Claude, Llama, Titan)
  - Smart model adapter that handles different JSON schemas per model family
  - Endpoint: POST /chat for streaming responses, GET /models for model list

  Frontend (/frontend/)
  - React 18 + TypeScript
  - Vite build system with HMR
  - Tailwind CSS for styling
  - Lucide React icons
  - ReadableStream API for consuming streamed responses

  Key Features

  ✓ Multi-model support - Claude Sonnet 4.5, Claude 3, Llama 3, Titan
  ✓ Real-time streaming - Chunks arrive progressively for better UX
  ✓ Configurable parameters - Temperature, max tokens, model selection
  ✓ Clean chat interface - Message history with user/assistant distinction
  ✓ Type-safe - TypeScript throughout frontend

  Communication Flow

  User Input → Frontend (React)
     → POST /chat (localhost:8000)
     → FastAPI Backend
     → AWS Bedrock (ca-central-1)
     → Stream Response
     → Frontend updates UI in real-time

  Tech Stack

  - Backend: Python 3.13, FastAPI, Uvicorn, boto3
  - Frontend: React 18, TypeScript 5.2, Vite 7.2, Tailwind CSS 4.1
  - Cloud: AWS Bedrock Runtime API

  Current State

  The code appears to be in initial development - all files are untracked in git. The application is
  development-ready with CORS enabled for local testing but would need enhancements for production
  (authentication, persistence, error recovery, etc.).