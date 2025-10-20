import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  Content,
} from '@google/generative-ai';
import { AgentType, MinimalChatMessage } from '../../lib/types';
import { getAgentSystemInstruction } from '../../lib/constants';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY && process.env.NODE_ENV === 'production') {
  throw new Error(
    'GEMINI_API_KEY environment variable is not set for production build.',
  );
} else if (!API_KEY) {
  console.warn('GEMINI_API_KEY is not set. AI features will be disabled.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function generateAgentResponse(
  agentType: AgentType,
  latestUserMessage: string,
  history: MinimalChatMessage[],
): Promise<string> {
  if (!genAI) {
    return 'The AI service is currently unavailable. Please check the API key configuration.';
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
  const systemInstruction = getAgentSystemInstruction(agentType);

  const chatHistory: Content[] = history.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));

  try {
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: chatHistory,
    });
    const result = await chat.sendMessage(
      `SYSTEM INSTRUCTION: ${systemInstruction}\n\nUSER MESSAGE: ${latestUserMessage}`,
    );
    return result.response.text();
  } catch (error) {
    console.error('Error generating response from Gemini:', error);
    throw new Error(
      'Failed to get a response from the AI. Please try again later.',
    );
  }
}
