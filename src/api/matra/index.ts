import { MastraClient } from "@mastra/client-js";

const client = new MastraClient({
  baseUrl: process.env.VITE_MASTRA_BASE_URL,
  retries: 3,
  backoffMs: 300,
  maxBackoffMs: 5000,
  headers: {
    "Authorization": process.env.VITE_MASTRA_TOKEN,
  },
});

export default client;
