import { listModels } from "./ask";
import { GROQ_FREE_MODELS } from "./types";
import { useApp } from "./store";

export async function loadRemoteModels() {
  const s = useApp.getState();
  const provider = s.prefs.api.provider;
  const apiKey = s.prefs.api.keys[provider] ?? "";
  try {
    const res = await listModels({
      data: {
        provider,
        apiKey,
        groqFreeOnly: s.prefs.api.groqFreeOnly,
      },
    });
    if (res.ok && res.models.length) {
      s.setRemoteModels(res.models);
      if (!res.models.some((m) => m.id === s.model)) {
        s.setModel(res.models[0]!.id);
      }
      return res;
    }
    if (provider === "groq" && s.prefs.api.groqFreeOnly) {
      s.setRemoteModels(GROQ_FREE_MODELS);
      if (!GROQ_FREE_MODELS.some((m) => m.id === s.model)) {
        s.setModel(GROQ_FREE_MODELS[0]!.id);
      }
      return { ok: true as const, models: GROQ_FREE_MODELS };
    }
    return res;
  } catch {
    if (provider === "groq" && s.prefs.api.groqFreeOnly) {
      s.setRemoteModels(GROQ_FREE_MODELS);
      return { ok: true as const, models: GROQ_FREE_MODELS };
    }
    return { ok: false as const, error: "network", models: [] };
  }
}
