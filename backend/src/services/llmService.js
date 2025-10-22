import OpenAI from 'openai';
import { config } from '../config.js';

let client = null;

const getClient = () => {
  if (!config.llm.apiKey) {
    throw new Error('LLM_API_KEY is not set.');
  }

  if (!client) {
    client = new OpenAI({
      apiKey: config.llm.apiKey,
      baseURL: config.llm.baseURL,
    });
  }

  return client;
};

export const generateItinerary = async (payload) => {
  const openai = getClient();

  const messages = [
    {
      role: 'system',
      content: 'You are an expert travel planner. Produce detailed itineraries including transport, lodging, dining, and kid friendly tips when relevant. Always answer in Markdown with sections for Overview, Daily Schedule, Logistics, Dining, Budget Breakdown, and Tips.',
    },
    {
      role: 'user',
      content: JSON.stringify(payload),
    },
  ];

  const response = await openai.chat.completions.create({
    model: config.llm.model,
    messages,
    temperature: 0.4,
  });

  return response.choices[0].message.content;
};

export const analyzeBudget = async (payload) => {
  const openai = getClient();

  const messages = [
    {
      role: 'system',
      content: 'You are a financial assistant helping travelers track expenses. Return a concise Markdown summary with a table of expenses, remaining budget, and suggestions to save money.',
    },
    {
      role: 'user',
      content: JSON.stringify(payload),
    },
  ];

  const response = await openai.chat.completions.create({
    model: config.llm.model,
    messages,
    temperature: 0.3,
  });

  return response.choices[0].message.content;
};
