# Healthcare AI - Healthcare Companion Frontend

A beautiful, personal AI companion frontend for breast cancer patient support. This React application provides an intuitive interface to interact with the HealthCareAI backend.

![Healthcare AI Screenshot](./screenshot.png)

## Features

### Core Features
- 💬 **Conversational AI Chat** - Natural language interface for healthcare questions
- 📚 **Knowledge Browser** - Browse curated topics and resources
- 🔄 **Dynamic Index Selection** - Switch between different knowledge bases
- 🎯 **Response Mode Toggle** - Choose between "Knowledge Base Only" or "AI + Knowledge Base" modes

### Source Citations
- 📖 **Clickable Sources** - View source citations with document titles
- 📄 **Source Modal** - Click any source to view the full extracted text
- ✓ **Evidence Indicators** - Visual feedback showing if answer is based on verified sources

### User Experience
- 🎨 **Calming Design** - Warm, supportive color palette designed for comfort
- 📱 **Responsive** - Works beautifully on desktop and mobile
- ⚡ **Fast & Modern** - Built with React 18, TypeScript, and Vite
- ♿ **Accessible** - ARIA labels, keyboard navigation, and semantic HTML

### Support Features
- 📞 **Helpline Integration** - Quick access to support helplines when available
- ⚠️ **Dynamic Disclaimers** - Context-aware medical disclaimers

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- HealthCareAI Backend running on port 8000

### Installation

1. Clone the repository:
```bash
git clone https://github.com/amulyatayal/HealthCareAI-FrontEnd.git
cd HealthCareAI-FrontEnd
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/              # React components
│   ├── ChatInterface.tsx        # Main chat UI with mode toggle
│   ├── Header.tsx               # App header with index selector
│   ├── IndexSelector.tsx        # Knowledge base dropdown selector
│   ├── MessageBubble.tsx        # Chat message with sources & disclaimer
│   ├── Sidebar.tsx              # Navigation sidebar
│   ├── SourceModal.tsx          # Full source text modal
│   ├── TopicsBrowser.tsx        # Knowledge topics browser
│   ├── TypingIndicator.tsx      # AI typing animation
│   └── WelcomeScreen.tsx        # Initial welcome UI
├── hooks/                   # Custom React hooks
│   └── useChat.ts               # Chat state management
├── services/                # API client
│   └── api.ts                   # Backend API calls
├── styles/                  # CSS styles
│   ├── index.css                # Global styles & variables
│   └── App.css                  # App layout styles
├── types/                   # TypeScript types
│   └── index.ts                 # API & component types
├── utils/                   # Utility functions
│   ├── index.ts                 # Exports
│   └── uuid.ts                  # UUID generation (HTTP-safe)
├── App.tsx                  # Main app component
└── main.tsx                 # App entry point
```

## Response Modes

### Knowledge Base Only (Strict Mode)
- Answers are sourced exclusively from verified medical documents
- Best for factual, citation-backed information
- Shows "Based on verified sources" indicator

### AI + Knowledge Base
- AI provides guidance using knowledge base as context
- Allows for more conversational, interpretive responses
- Clearly indicates when AI is providing general guidance

## API Endpoints

The frontend connects to these backend endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/chat` | POST | Send a message (with `index_name`, `strict_mode`, `include_sources`) |
| `/api/v1/chat/history/{id}` | GET | Get chat history |
| `/api/v1/chat/history/{id}` | DELETE | Clear chat |
| `/api/v1/knowledge/search` | POST | Search knowledge base |
| `/api/v1/knowledge/topics` | GET | Get all topics |
| `/api/v1/knowledge/indexes` | GET | Get available knowledge base indexes |
| `/health` | GET | Health check |

### Chat Request Body

```json
{
  "message": "What exercises can I do after surgery?",
  "session_id": "optional-session-id",
  "index_name": "breast_cancer_kb",
  "strict_mode": true,
  "include_sources": true
}
```

### Chat Response

```json
{
  "session_id": "uuid",
  "answer": "Based on your question...",
  "sources": [
    {
      "title": "Exercises After Surgery",
      "snippet": "Brief excerpt...",
      "source_text": "Full extracted text for modal...",
      "url": "optional-url"
    }
  ],
  "disclaimer": "This information is for educational purposes...",
  "has_sufficient_evidence": true,
  "support_helpline": "1-800-XXX-XXXX",
  "support_helpline_name": "Cancer Support Line",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

## Design Philosophy

Healthcare AI is designed with compassion in mind. The interface uses:

- **Warm Rose & Lavender tones** - Calming and hopeful
- **Sage Green accents** - For active/selected states (mode toggle)
- **Crimson Pro serif font** - Elegant and approachable
- **DM Sans for UI** - Clean and readable
- **Soft shadows & gradients** - Gentle depth without harshness

## Environment Variables

The development server proxies API requests to the backend. For production, configure:

- `VITE_API_URL` - Backend API URL (optional, defaults to same origin)

## Deployment

### For EC2/Production

1. Build the application:
```bash
npm run build
```

2. Serve the `dist` folder using nginx or your preferred web server

3. Configure your web server to proxy `/api` requests to the backend

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - See LICENSE file for details.

---

Built with 💗 for breast cancer patients and their caregivers.
