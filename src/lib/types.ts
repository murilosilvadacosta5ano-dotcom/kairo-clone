export type Role = "user" | "assistant";

export type MainView =
  | "home"
  | "chat"
  | "conversations"
  | "projects"
  | "project"
  | "code"
  | "artifacts"
  | "artifact";

export type SettingsPage =
  | "index"
  | "profile"
  | "billing"
  | "notifications"
  | "focus"
  | "privacy"
  | "shared"
  | "features"
  | "connectors"
  | "permissions"
  | "appearance"
  | "language"
  | "instructions"
  | "story"
  | "api"
  | "background"
  | "about";

export type AiProvider =
  | "grok"
  | "openai"
  | "gemini"
  | "groq"
  | "anthropic"
  | "openrouter";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
  temporary?: boolean;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: number;
}

export interface Artifact {
  id: string;
  title: string;
  kind: "code" | "doc" | "html";
  language?: string;
  content: string;
  conversationId?: string;
  createdAt: number;
}

export interface RemoteModel {
  id: string;
  name: string;
  blurb?: string;
}

export const FALLBACK_MODELS: RemoteModel[] = [
  { id: "flash-lite", name: "3.5 Flash Lite", blurb: "Rápido" },
  { id: "flash", name: "3.6 Flash", blurb: "Equilíbrio" },
  { id: "pro", name: "3.1 Pro", blurb: "Mais profundo" },
];

export const MODELS = FALLBACK_MODELS;

export const PROVIDERS: { id: AiProvider; label: string }[] = [
  { id: "grok", label: "Grok" },
  { id: "openai", label: "ChatGPT" },
  { id: "gemini", label: "Gemini" },
  { id: "groq", label: "Groq" },
  { id: "anthropic", label: "Claude" },
  { id: "openrouter", label: "OpenRouter" },
];

export const GROQ_FREE_MODELS: RemoteModel[] = [
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", blurb: "Free · rápido" },
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", blurb: "Free · forte" },
  { id: "gemma2-9b-it", name: "Gemma 2 9B", blurb: "Free" },
  { id: "meta-llama/llama-4-scout-17b-16e-instruct", name: "Llama 4 Scout", blurb: "Free" },
  { id: "qwen/qwen3-32b", name: "Qwen 3 32B", blurb: "Free" },
  { id: "moonshotai/kimi-k2-instruct", name: "Kimi K2", blurb: "Free" },
  { id: "openai/gpt-oss-20b", name: "GPT-OSS 20B", blurb: "Free" },
];

export const USER = {
  firstName: "Muri",
  fullName: "Murilo Silva da Costa",
  email: "murilosilva.dacosta12@gmail.com",
  initials: "MS",
};

export function modelLabel(id: string, remote: RemoteModel[]) {
  return (
    remote.find((m) => m.id === id)?.name ??
    FALLBACK_MODELS.find((m) => m.id === id)?.name ??
    id
  );
}

export function visibleModels(remote: RemoteModel[]) {
  return remote.length > 0 ? remote : FALLBACK_MODELS;
}
