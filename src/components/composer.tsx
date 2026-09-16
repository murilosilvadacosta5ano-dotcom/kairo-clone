import { useRef } from "react";
import { ArrowUp, Menu } from "lucide-react";
import { useApp } from "@/lib/store";
import { USER } from "@/lib/types";
import { cn } from "@/lib/utils";
import { askClaude } from "@/lib/ask";

export function Composer({ compact }: { compact?: boolean }) {
  const draft = useApp((s) => s.draft);
  const setDraft = useApp((s) => s.setDraft);
  const sending = useApp((s) => s.sending);
  const setAttach = useApp((s) => s.setAttach);
  const openSettings = useApp((s) => s.openSettings);
  const conversations = useApp((s) => s.conversations);
  const currentId = useApp((s) => s.currentId);
  const profileName = useApp((s) => s.prefs.profile.displayName);
  const story = useApp((s) => s.prefs.story);
  const onSend = useSend();
  const ref = useRef<HTMLTextAreaElement>(null);
  const hasText = draft.trim().length > 0;
  const conv = conversations.find((c) => c.id === currentId);
  const replyTo = conv?.title && conv.messages.length > 0 ? conv.title : "Claude";
  const chip =
    (story.enabled && story.character.trim()) ||
    profileName.trim() ||
    USER.firstName;

  function resize() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  return (
    <div className={cn("px-3 pb-3 pt-1", compact && "pb-3")}>
      <div className="rounded-[28px] bg-bar px-4 pb-3 pt-3.5">
        <textarea
          ref={ref}
          rows={1}
          value={draft}
          disabled={sending}
          placeholder={`Responder · ${replyTo}.`}
          onChange={(e) => {
            setDraft(e.target.value);
            resize();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (hasText && !sending) onSend();
            }
          }}
          className="max-h-[120px] w-full resize-none bg-transparent text-[17px] leading-snug text-bar-fg outline-none placeholder:text-bar-muted disabled:opacity-60"
        />

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => openSettings("profile")}
            className="press flex h-10 items-center gap-2 rounded-full border border-bar-line bg-bar-chip py-1 pl-1 pr-3.5 text-bar-fg"
          >
            <MuriAvatar />
            <span className="max-w-[140px] truncate text-[15px] font-medium">
              {chip}
            </span>
          </button>

          {story.enabled ? (
            <button
              type="button"
              onClick={() => openSettings("story")}
              className="press flex h-10 items-center rounded-full border border-bar-line px-3 text-[13px] font-medium text-bar-fg"
            >
              História
            </button>
          ) : null}

          <div className="flex-1" />

          {hasText ? (
            <button
              type="button"
              aria-label="Enviar"
              disabled={sending}
              onClick={onSend}
              className="press flex size-11 shrink-0 items-center justify-center rounded-full border border-bar-line bg-bar-chip text-bar-fg disabled:opacity-40"
            >
              <ArrowUp className="size-5" strokeWidth={2.2} />
            </button>
          ) : (
            <button
              type="button"
              aria-label="Mais opções"
              onClick={() => setAttach(true)}
              className="press flex size-11 shrink-0 items-center justify-center rounded-full border border-bar-line text-bar-fg"
            >
              <Menu className="size-5" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MuriAvatar() {
  return (
    <svg viewBox="0 0 36 36" className="size-8 shrink-0" aria-hidden="true">
      <circle cx="18" cy="18" r="18" fill="#d7c4b0" />
      <circle cx="18" cy="18" r="17" fill="#f0d5c0" />
      <path d="M6 28c2-8 7-12 12-12s10 4 12 12" fill="#3d2a1c" />
      <path d="M8 16c1-9 5-13 10-13s9 4 10 13c-2-3-6-5-10-5s-8 2-10 5Z" fill="#3a2418" />
      <path d="M11 15c2-1 4-2 7-2s5 1 7 2" fill="none" stroke="#2a1810" strokeWidth="1.2" />
      <circle cx="13.2" cy="19.2" r="1.15" fill="#1a1210" />
      <circle cx="22.8" cy="19.2" r="1.15" fill="#1a1210" />
      <path d="M12.2 19.2h2.2M21.6 19.2h2.2" stroke="#1a1210" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M11 19.2c0-1.6 1-2.4 2.2-2.4s2.2.8 2.2 2.4" fill="none" stroke="#1a1210" strokeWidth="1.15" />
      <path d="M20.6 19.2c0-1.6 1-2.4 2.2-2.4s2.2.8 2.2 2.4" fill="none" stroke="#1a1210" strokeWidth="1.15" />
      <path d="M16.2 23.2c.7.8 2.9.8 3.6 0" fill="none" stroke="#c47a6a" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function useSend() {
  const addUserMessage = useApp((s) => s.addUserMessage);
  const finishAssistant = useApp((s) => s.finishAssistant);
  const failAssistant = useApp((s) => s.failAssistant);
  const addArtifact = useApp((s) => s.addArtifact);
  const draft = useApp((s) => s.draft);
  const sending = useApp((s) => s.sending);
  const model = useApp((s) => s.model);
  const prefs = useApp((s) => s.prefs);

  return async function send() {
    const text = draft.trim();
    if (!text || sending) return;
    const { convId, messages } = addUserMessage(text);
    const provider = prefs.api.provider;
    try {
      const res = await askClaude({
        data: {
          messages,
          model,
          provider,
          apiKey: prefs.api.keys[provider],
          instructions: prefs.instructions,
          profile: prefs.profile,
          story: prefs.story,
        },
      });
      if (res.ok) {
        finishAssistant(convId, res.text);
        if (prefs.features.artifacts) {
          const blocks = [...res.text.matchAll(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g)];
          for (const b of blocks) {
            const body = b[2].trim();
            if (body.split("\n").length < 6) continue;
            const lang = b[1] || "text";
            const kind = lang === "html" ? "html" : "code";
            const first = body.split("\n").find((l) => l.trim()) ?? "Artefato";
            addArtifact({
              title: first.replace(/^[#/\s*]+/, "").slice(0, 48) || "Artefato",
              kind,
              language: lang,
              content: body,
              conversationId: convId,
            });
          }
        }
      } else if (res.error === "missing-key") {
        failAssistant(
          convId,
          "Coloque uma chave de API em Configurações → API para falar com a IA.",
        );
      } else {
        failAssistant(
          convId,
          `Não consegui responder agora (${res.error}). Verifique a chave e o modelo em Configurações → API.`,
        );
      }
    } catch {
      failAssistant(convId);
    }
  };
}
