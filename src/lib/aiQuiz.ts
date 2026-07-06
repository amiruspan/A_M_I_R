import { supabase } from './supabase';
import type { QuizQuestion } from './quizTypes';

export type AiQuizDraft = {
  title: string;
  description: string;
  questions: QuizQuestion[];
};

type RawAiQuiz = {
  title?: unknown;
  description?: unknown;
  questions?: unknown;
};

const systemPrompt = [
  'You create short school quizzes for teenagers.',
  'Return only valid JSON, without markdown.',
  'Schema: {"title":"string","description":"string","questions":[{"text":"string","options":["string","string","string","string"],"correctIndex":0}]}',
  'Use the same language as the user topic.',
  'Every question must have exactly 4 options and one correctIndex from 0 to 3.',
].join(' ');

export async function generateQuizDraft(topic: string, questionCount: number): Promise<AiQuizDraft> {
  const prompt = [
    `Topic: ${topic}`,
    `Questions: ${questionCount}`,
    'Make questions clear, not too long, and suitable for a quiz game.',
  ].join('\n');

  const { data, error } = await supabase.functions.invoke<{ text?: string; error?: string }>('ai', {
    body: { prompt, system: systemPrompt },
  });

  if (error) throw new Error(getFriendlyFunctionError(error.message));
  if (data?.error) throw new Error(data.error);
  if (!data?.text) throw new Error('AI did not return quiz text.');

  return parseAiQuiz(data.text, questionCount);
}

function getFriendlyFunctionError(message: string) {
  const cleanMessage = message.toLowerCase();
  if (cleanMessage.includes('404') || cleanMessage.includes('not found')) {
    return 'AI function is not deployed yet. Run npm run ai:secret -- GEMINI_API_KEY=... and npm run ai:deploy.';
  }
  if (cleanMessage.includes('failed to fetch') || cleanMessage.includes('fetch')) {
    return 'AI function is not reachable. Deploy it with npm run ai:deploy, then refresh the page.';
  }
  if (cleanMessage.includes('429') || cleanMessage.includes('quota')) {
    return 'Gemini quota is not available for this API key. Create a new GEMINI_API_KEY in Google AI Studio, then run npm run ai:secret -- GEMINI_API_KEY=...';
  }
  if (cleanMessage.includes('gemini_api_key')) {
    return 'GEMINI_API_KEY is missing in Supabase secrets. Run npm run ai:secret -- GEMINI_API_KEY=...';
  }
  return message;
}

function parseAiQuiz(text: string, questionCount: number): AiQuizDraft {
  const raw = JSON.parse(extractJson(text)) as RawAiQuiz;
  const title = readText(raw.title, 'AI Quiz').slice(0, 80);
  const description = readText(raw.description, 'Generated quiz').slice(0, 180);
  const questions = Array.isArray(raw.questions) ? raw.questions : [];

  const cleanQuestions = questions
    .map(readQuestion)
    .filter((question): question is QuizQuestion => question !== null)
    .slice(0, questionCount);

  if (cleanQuestions.length === 0) {
    throw new Error('AI returned a broken quiz. Try another topic.');
  }

  return { title, description, questions: cleanQuestions };
}

function readQuestion(value: unknown): QuizQuestion | null {
  if (!isRecord(value) || !Array.isArray(value.options)) return null;
  const text = readText(value.text, '');
  const options = value.options.map((option) => readText(option, '')).filter(Boolean).slice(0, 4);
  const correctIndex = Number(value.correctIndex);

  if (!text || options.length !== 4 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) {
    return null;
  }

  return { text, options, correctIndex };
}

function extractJson(text: string) {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) throw new Error('AI did not return JSON.');
  return text.slice(firstBrace, lastBrace + 1);
}

function readText(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
