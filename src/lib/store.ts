import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AiProvider,
  Artifact,
  ChatMessage,
  Conversation,
  MainView,
  Project,
  RemoteModel,
  SettingsPage,
} from "./types";
import { uid } from "./utils";

export interface UserProfile {
  displayName: string;
  age: string;
  gender: string;
  description: string;
}

export interface StoryPrefs {
  enabled: boolean;
  title: string;
  body: string;
  character: string;
}

export interface ApiPrefs {
  provider: AiProvider;
  keys: Partial<Record<AiProvider, string>>;
  groqFreeOnly: boolean;
}

export interface Prefs {
  notifications: {
    replies: boolean;
    tips: boolean;
    product: boolean;
  };
  focus: {
    dnd: boolean;
    usageLimit: boolean;
  };
  privacy: {
    train: boolean;
    improve: boolean;
  };
  features: {
    artifacts: boolean;
    research: boolean;
    analysis: boolean;
  };
  appearance: "system" | "light" | "dark";
  language: "pt-BR" | "en";
  connectors: Record<string, boolean>;
  permissions: {
    camera: boolean;
    mic: boolean;
    photos: boolean;
  };
  profile: UserProfile;
  instructions: string;
  story: StoryPrefs;
  chatBg: string | null;
  api: ApiPrefs;
}

const defaultPrefs: Prefs = {
  notifications: { replies: true, tips: true, product: false },
  focus: { dnd: false, usageLimit: false },
  privacy: { train: false, improve: true },
  features: { artifacts: true, research: true, analysis: true },
  appearance: "light",
  language: "pt-BR",
  connectors: {},
  permissions: { camera: true, mic: true, photos: true },
  profile: {
    displayName: "Muri",
    age: "",
    gender: "",
    description: "",
  },
  instructions: "",
  story: { enabled: false, title: "", body: "", character: "" },
  chatBg: null,
  api: { provider: "grok", keys: {}, groqFreeOnly: true },
};

interface AppState {
  hydrated: boolean;
  view: MainView;
  sidebarOpen: boolean;
  settingsOpen: boolean;
  settingsPage: SettingsPage;
  modelPickerOpen: boolean;
  upgradeOpen: boolean;
  attachOpen: boolean;
  voiceOpen: boolean;
  infoOpen: boolean;
  model: string;
  remoteModels: RemoteModel[];
  conversations: Conversation[];
  currentId: string | null;
  projects: Project[];
  currentProjectId: string | null;
  artifacts: Artifact[];
  currentArtifactId: string | null;
  sending: boolean;
  prefs: Prefs;
  draft: string;

  setHydrated: () => void;
  setDraft: (v: string) => void;
  setView: (v: MainView) => void;
  setSidebar: (open: boolean) => void;
  openSettings: (page?: SettingsPage) => void;
  closeSettings: () => void;
  setSettingsPage: (p: SettingsPage) => void;
  setModelPicker: (open: boolean) => void;
  setUpgrade: (open: boolean) => void;
  setAttach: (open: boolean) => void;
  setVoice: (open: boolean) => void;
  setInfo: (open: boolean) => void;
  setModel: (m: string) => void;
  setRemoteModels: (m: RemoteModel[]) => void;
  newChat: (opts?: { temporary?: boolean; projectId?: string }) => string;
  openConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  addUserMessage: (content: string) => { convId: string; messages: ChatMessage[] };
  finishAssistant: (convId: string, content: string) => void;
  failAssistant: (convId: string, message?: string) => void;
  setSending: (v: boolean) => void;
  addProject: (name: string, description: string) => string;
  openProject: (id: string) => void;
  deleteProject: (id: string) => void;
  addArtifact: (a: Omit<Artifact, "id" | "createdAt">) => void;
  openArtifact: (id: string) => void;
  deleteArtifact: (id: string) => void;
  patchPrefs: (p: Partial<Prefs> | ((prev: Prefs) => Prefs)) => void;
  resetAll: () => void;
}

function titleFrom(text: string) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > 42 ? `${t.slice(0, 42)}…` : t || "Novo bate-papo";
}

function mergePrefs(saved: Prefs | undefined): Prefs {
  if (!saved) return defaultPrefs;
  return {
    ...defaultPrefs,
    ...saved,
    notifications: { ...defaultPrefs.notifications, ...saved.notifications },
    focus: { ...defaultPrefs.focus, ...saved.focus },
    privacy: { ...defaultPrefs.privacy, ...saved.privacy },
    features: { ...defaultPrefs.features, ...saved.features },
    permissions: { ...defaultPrefs.permissions, ...saved.permissions },
    profile: { ...defaultPrefs.profile, ...saved.profile },
    story: { ...defaultPrefs.story, ...saved.story },
    api: {
      ...defaultPrefs.api,
      ...saved.api,
      keys: { ...defaultPrefs.api.keys, ...saved.api?.keys },
    },
    connectors: saved.connectors ?? {},
    instructions: saved.instructions ?? "",
    chatBg: saved.chatBg ?? null,
  };
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      view: "home",
      sidebarOpen: false,
      settingsOpen: false,
      settingsPage: "index",
      modelPickerOpen: false,
      upgradeOpen: false,
      attachOpen: false,
      voiceOpen: false,
      infoOpen: false,
      model: "flash-lite",
      remoteModels: [],
      conversations: [],
      currentId: null,
      projects: [],
      currentProjectId: null,
      artifacts: [],
      currentArtifactId: null,
      sending: false,
      prefs: defaultPrefs,
      draft: "",

      setHydrated: () => set({ hydrated: true }),
      setDraft: (draft) => set({ draft }),
      setView: (view) => set({ view, sidebarOpen: false }),
      setSidebar: (sidebarOpen) => set({ sidebarOpen }),
      openSettings: (page = "index") =>
        set({ settingsOpen: true, settingsPage: page, sidebarOpen: false }),
      closeSettings: () => set({ settingsOpen: false, settingsPage: "index" }),
      setSettingsPage: (settingsPage) => set({ settingsPage }),
      setModelPicker: (modelPickerOpen) => set({ modelPickerOpen }),
      setUpgrade: (upgradeOpen) => set({ upgradeOpen }),
      setAttach: (attachOpen) => set({ attachOpen }),
      setVoice: (voiceOpen) => set({ voiceOpen }),
      setInfo: (infoOpen) => set({ infoOpen }),
      setModel: (model) => set({ model, modelPickerOpen: false }),
      setRemoteModels: (remoteModels) => set({ remoteModels }),

      newChat: (opts) => {
        const id = uid();
        const conv: Conversation = {
          id,
          title: opts?.temporary ? "Bate-papo temporário" : "Novo bate-papo",
          messages: [],
          updatedAt: Date.now(),
          temporary: opts?.temporary,
          projectId: opts?.projectId,
        };
        set((s) => ({
          conversations: [conv, ...s.conversations],
          currentId: id,
          view: "home",
          sidebarOpen: false,
          draft: "",
        }));
        return id;
      },

      openConversation: (id) => {
        const conv = get().conversations.find((c) => c.id === id);
        set({
          currentId: id,
          view: conv && conv.messages.length > 0 ? "chat" : "home",
          sidebarOpen: false,
        });
      },

      deleteConversation: (id) =>
        set((s) => {
          const conversations = s.conversations.filter((c) => c.id !== id);
          const currentId = s.currentId === id ? null : s.currentId;
          return {
            conversations,
            currentId,
            view: currentId ? s.view : "home",
          };
        }),

      renameConversation: (id, title) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, title } : c,
          ),
        })),

      addUserMessage: (content) => {
        const text = content.trim();
        let convId = get().currentId;
        const msg: ChatMessage = {
          id: uid(),
          role: "user",
          content: text,
          createdAt: Date.now(),
        };
        if (!convId) {
          convId = uid();
          const conv: Conversation = {
            id: convId,
            title: titleFrom(text),
            messages: [msg],
            updatedAt: Date.now(),
          };
          set((s) => ({
            conversations: [conv, ...s.conversations],
            currentId: convId,
            view: "chat",
            draft: "",
            sending: true,
          }));
          return { convId, messages: [msg] };
        }
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  title:
                    c.messages.length === 0 ? titleFrom(text) : c.title,
                  messages: [...c.messages, msg],
                  updatedAt: Date.now(),
                }
              : c,
          ),
          view: "chat",
          draft: "",
          sending: true,
        }));
        const conv = get().conversations.find((c) => c.id === convId);
        return { convId, messages: conv?.messages ?? [msg] };
      },

      finishAssistant: (convId, content) => {
        const msg: ChatMessage = {
          id: uid(),
          role: "assistant",
          content,
          createdAt: Date.now(),
        };
        set((s) => ({
          sending: false,
          conversations: s.conversations.map((c) =>
            c.id === convId
              ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() }
              : c,
          ),
        }));
      },

      failAssistant: (convId, message) => {
        const msg: ChatMessage = {
          id: uid(),
          role: "assistant",
          content:
            message ||
            "Não consegui responder agora. Verifique a chave de API em Configurações → API.",
          createdAt: Date.now(),
        };
        set((s) => ({
          sending: false,
          conversations: s.conversations.map((c) =>
            c.id === convId
              ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() }
              : c,
          ),
        }));
      },

      setSending: (sending) => set({ sending }),

      addProject: (name, description) => {
        const id = uid();
        const project: Project = {
          id,
          name,
          description,
          createdAt: Date.now(),
        };
        set((s) => ({
          projects: [project, ...s.projects],
          currentProjectId: id,
          view: "project",
        }));
        return id;
      },

      openProject: (id) =>
        set({ currentProjectId: id, view: "project", sidebarOpen: false }),

      deleteProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          view: s.currentProjectId === id ? "projects" : s.view,
          currentProjectId:
            s.currentProjectId === id ? null : s.currentProjectId,
        })),

      addArtifact: (a) => {
        const art: Artifact = { ...a, id: uid(), createdAt: Date.now() };
        set((s) => ({ artifacts: [art, ...s.artifacts] }));
      },

      openArtifact: (id) =>
        set({ currentArtifactId: id, view: "artifact", sidebarOpen: false }),

      deleteArtifact: (id) =>
        set((s) => ({
          artifacts: s.artifacts.filter((a) => a.id !== id),
          view: s.currentArtifactId === id ? "artifacts" : s.view,
          currentArtifactId:
            s.currentArtifactId === id ? null : s.currentArtifactId,
        })),

      patchPrefs: (p) =>
        set((s) => ({
          prefs: typeof p === "function" ? p(s.prefs) : { ...s.prefs, ...p },
        })),

      resetAll: () =>
        set({
          conversations: [],
          currentId: null,
          projects: [],
          artifacts: [],
          view: "home",
          settingsOpen: false,
          draft: "",
        }),
    }),
    {
      name: "claude-muri",
      skipHydration: true,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>;
        return {
          ...current,
          ...p,
          prefs: mergePrefs(p.prefs),
          model: typeof p.model === "string" ? p.model : current.model,
        };
      },
      partialize: (s) => ({
        conversations: s.conversations.filter((c) => !c.temporary),
        currentId: s.currentId,
        projects: s.projects,
        artifacts: s.artifacts,
        model: s.model,
        prefs: s.prefs,
      }),
    },
  ),
);

export function currentConversation() {
  const { conversations, currentId } = useApp.getState();
  return conversations.find((c) => c.id === currentId) ?? null;
}
