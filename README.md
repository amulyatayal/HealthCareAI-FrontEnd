# HopeAI - Healthcare Companion Frontend

A beautiful, compassionate AI companion frontend for breast cancer patient support. This React application provides an intuitive interface to interact with the HealthCareAI backend.

![HopeAI Screenshot](./screenshot.png)

## Features

- 💬 **Conversational AI Chat** - Natural language interface for healthcare questions
- 📚 **Knowledge Browser** - Browse curated topics and resources
- 🎨 **Calming Design** - Warm, supportive color palette designed for comfort
- 📱 **Responsive** - Works beautifully on desktop and mobile
- ⚡ **Fast & Modern** - Built with React 18, TypeScript, and Vite
- ♿ **Accessible** - ARIA labels, keyboard navigation, and semantic HTML

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- HealthCareAI Backend running on port 8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatInterface.tsx    # Main chat UI
│   ├── Header.tsx           # App header
│   ├── MessageBubble.tsx    # Chat message display
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── TopicsBrowser.tsx    # Knowledge topics browser
│   ├── TypingIndicator.tsx  # AI typing animation
│   └── WelcomeScreen.tsx    # Initial welcome UI
├── hooks/               # Custom React hooks
│   └── useChat.ts           # Chat state management
├── services/            # API client
│   └── api.ts               # Backend API calls
├── styles/              # CSS styles
│   ├── index.css            # Global styles & variables
│   └── App.css              # App layout styles
├── types/               # TypeScript types
│   └── index.ts             # API & component types
├── App.tsx              # Main app component
└── main.tsx             # App entry point
```

## Design Philosophy

HopeAI is designed with compassion in mind. The interface uses:

- **Warm Rose & Lavender tones** - Calming and hopeful
- **Sage Green accents** - Healing and natural
- **Crimson Pro serif font** - Elegant and approachable
- **DM Sans for UI** - Clean and readable
- **Soft shadows & gradients** - Gentle depth without harshness

## API Endpoints

The frontend connects to these backend endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/chat` | POST | Send a message |
| `/api/v1/chat/history/{id}` | GET | Get chat history |
| `/api/v1/chat/history/{id}` | DELETE | Clear chat |
| `/api/v1/knowledge/search` | POST | Search knowledge base |
| `/api/v1/knowledge/topics` | GET | Get all topics |
| `/health` | GET | Health check |

## Environment Variables

The development server proxies API requests to the backend. For production, configure:

- `VITE_API_URL` - Backend API URL (optional, defaults to same origin)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - See LICENSE file for details.

---

Built with 💗 for breast cancer patients and their caregivers.

