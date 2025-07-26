# 🤖 Telegram Bot with Mastra AI

A lightweight Telegram bot powered by [Mastra AI](https://mastra.ai), designed to facilitate dynamic conversations between Telegram users and AI agents. This project is containerized with Docker and ready for scalable deployment.

---

## 🚀 Features

* Chat with AI agents using Mastra API
* Built with Node.js + TypeScript
* Dockerized for ease of deployment
* Ready for future enhancement with Telegram Webhooks

---

## 🔧 Environment Configuration

Create a `.env` file in your project root using the following template:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Optional: for enabling webhooks (recommended for high-traffic bots)
# TELEGRAM_BOT_PORT=8000
# TELEGRAM_BOT_WEBHOOK_DOMAIN=https://your-domain.com
# TELEGRAM_BOT_SECRET=your_webhook_secret

VITE_MASTRA_BASE_URL=http://localhost:4111
VITE_MASTRA_TOKEN=your_mastra_token
```

---

## 🐳 Docker Setup

Build and run the bot using Docker:

```bash
# Build the image
docker build -t telegram-mastra-bot .

# Run the container
docker run --env-file .env telegram-mastra-bot
```

---

## 🛠 Development

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Build the TypeScript code:

```bash
npm run build
```

Run the compiled code:

```bash
node dist/index.js
```

---

## 📦 Project Structure

```
├── dist/                 # Compiled JS output
├── src/                  # Source files
├── Dockerfile
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 📝 To-Do

* [ ] Add Telegram Webhook support for scalable performance
* [ ] Logging & analytics integration
* [ ] Message queue support for concurrency