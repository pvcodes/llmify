# LLMify 🧠

> Unified AI chat interface for multiple language models

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.5-2D3748)](https://www.prisma.io)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

LLMify is a unified chat interface that lets you interact with multiple AI models (OpenAI, Anthropic, DeepSeek, xAI, and more) through a single, elegant interface. Use your own API keys or the platform's global key.

---

## ✨ Features

- **Multi-Model Support** — Access GPT, Claude, DeepSeek, Grok, Gemini, and more from one place
- **Local API Key Storage** — Your keys stay encrypted in your browser using Web Crypto API
- **Smart Conversations** — Context-aware chat with memory and customization
- **Fine-Tuned Controls** — Adjust creativity, length, and technical depth
- **Usage Analytics** — Track tokens, costs, and model performance
- **Real-time Streaming** — Get responses as they're generated
- **Responsive Design** — Works seamlessly on desktop and mobile
- **Dark/Light Theme** — System theme detection with manual toggle
- **Secure & Private** — API keys never leave your device

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended)
- PostgreSQL database
- API keys for your chosen providers

### Installation

```bash
# Clone the repository
git clone https://github.com/pvcodes/LLMify.git
cd LLMify

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
pnpm db:generate

# Push database schema
npx prisma db push

# Start development server
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/llmify"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

---

## 🛠 Tech Stack

| Category       | Technology              |
| -------------- | ----------------------- |
| Framework      | Next.js 15 (App Router) |
| Language       | TypeScript              |
| Database       | PostgreSQL + Prisma     |
| Authentication | NextAuth.js             |
| AI SDK         | Vercel AI SDK           |
| UI             | Radix UI + Tailwind CSS |
| State          | Zustand                 |
| Animations     | Framer Motion           |

---

## 📁 Project Structure

```
src/
├── actions/           # Server actions
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/           # Base UI components
│   ├── chat/         # Chat-specific components
│   ├── landing-page/ # Landing page sections
│   └── settings/     # Settings pages
├── hooks/            # Custom React hooks
├── lib/              # Utilities, configs, AI logic
└── store/            # Zustand stores
```

---

## 🔧 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint with auto-fix
pnpm db:generate  # Generate Prisma client
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) for the amazing AI SDK
- [Radix UI](https://radix-ui.com) for accessible components
- All the AI providers making LLMs accessible

---

<div align="center">

Built with 💜 by [pvcodes](https://github.com/pvcodes)

</div>
