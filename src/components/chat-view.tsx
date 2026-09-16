import { useEffect, useRef, useState } from "react";
import { Bot, Copy, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { ChatStage } from "./chat-stage";
import { Composer } from "./composer";
import { Markdown } from "./markdown";
import { TopBar } from "./top-bar";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ChatView() {
  const currentId = useApp((s) => s.currentId);
  const conversations = useApp((s) => s.conversations);
  const customBots = useApp((s) => s.customBots);
  const openBotEdit = useApp((s) => s.openBotEdit);
  const sending = useApp((s) => s.sending);
  const deleteConversation = useApp((s) => s.deleteConversation);
  const renameConversation = useApp((s) => s.renameConversation);
  const conv = conversations.find((c) => c.id === currentId);
  const activeBot = conv?.botId ? customBots.find((b) => b.id === conv.botId) : null;
  const scroller = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [conv?.messages.length, sending]);

  if (!conv) return null;

  return (
    <ChatStage>
      <TopBar
        right={
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              aria-label="Mais"
              onClick={() => setMenu(true)}
              className="press flex size-10 items-center justify-center rounded-full bg-white/[0.07] hover:bg-white/[0.14] backdrop-blur-xl border border-white/10 text-white transition-all shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
            >
              <MoreHorizontal className="size-5" strokeWidth={1.8} />
            </button>
          </div>
        }
      />

      <div
        ref={scroller}
        className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-3.5">
          {conv.messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex w-full",
                m.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "min-w-0 rounded-[26px] px-5 py-3.5 backdrop-blur-sm shadow-md transition-all",
                  m.role === "user"
                    ? "max-w-[85%] bg-[#25252e]/70 text-white"
                    : "max-w-[88%] bg-[#131317]/70 text-zinc-100",
                )}
              >
                {m.role === "user" ? (
                  <p className="whitespace-pre-wrap text-[16px] leading-relaxed text-white">
                    {m.content}
                  </p>
                ) : (
                  <AssistantMessage content={m.content} />
                )}
              </div>
            </div>
          ))}
          {sending ? (
            <div className="flex w-full justify-start py-2 px-1">
              <div className="flex items-center gap-2 thinking-inverted-diff select-none">
                <span className="text-[15px] font-medium tracking-wide">
                  pensando…
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className="size-1.5 rounded-full bg-white animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="size-1.5 rounded-full bg-white animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="size-1.5 rounded-full bg-white animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl px-2 sm:px-4 pb-[max(12px,calc(env(safe-area-inset-bottom)+8px))]">
        <Composer compact />
      </div>

      {menu ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          <button
            type="button"
            aria-label="Fechar"
            className="backdrop-in absolute inset-0 bg-fg/30"
            onClick={() => {
              setMenu(false);
              setRenaming(false);
            }}
          />
          <div
            role="dialog"
            className="sheet-in relative z-10 w-full max-w-[430px] rounded-t-sheet bg-bg px-5 pb-8 pt-4 md:rounded-sheet"
            style={{ boxShadow: "var(--shadow-sheet)" }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted-2" />
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeBot ? (
                  <div className="flex items-center gap-2">
                    {activeBot.photo ? (
                      <img
                        src={activeBot.photo}
                        alt={activeBot.name}
                        className="size-7 rounded-full object-cover ring-1 ring-white/20"
                      />
                    ) : (
                      <Bot className="size-5 text-zinc-300" />
                    )}
                    <h2 className="text-[17px] font-semibold">{activeBot.name}</h2>
                  </div>
                ) : (
                  <h2 className="text-[17px] font-semibold">Conversa</h2>
                )}
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => {
                  setMenu(false);
                  setRenaming(false);
                }}
                className="press flex size-9 items-center justify-center rounded-full bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            {renaming ? (
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (titleDraft.trim()) {
                    renameConversation(conv.id, titleDraft.trim());
                  }
                  setRenaming(false);
                  setMenu(false);
                }}
              >
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  className="h-11 min-w-0 flex-1 rounded-xl bg-muted px-3 text-[15px] outline-none"
                />
                <button
                  type="submit"
                  className="press h-11 rounded-pill bg-ink px-4 text-[14px] font-medium text-surface"
                >
                  Salvar
                </button>
              </form>
            ) : (
              <div className="flex flex-col">
                {activeBot && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenu(false);
                      openBotEdit(activeBot);
                    }}
                    className="press flex h-12 items-center gap-3 text-left text-[16px] text-white font-medium hover:text-zinc-200"
                  >
                    <Pencil className="size-4 text-zinc-300" />
                    Editar bot
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setTitleDraft(conv.title);
                    setRenaming(true);
                  }}
                  className="press flex h-12 items-center gap-3 text-left text-[16px]"
                >
                  <Pencil className="size-4" />
                  Renomear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = conv.messages
                      .map((m) => `${m.role === "user" ? "Você" : "Kairo"}: ${m.content}`)
                      .join("\n\n");
                    void navigator.clipboard.writeText(text);
                    setMenu(false);
                  }}
                  className="press flex h-12 items-center gap-3 text-left text-[16px]"
                >
                  <Copy className="size-4" />
                  Copiar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteConversation(conv.id);
                    setMenu(false);
                  }}
                  className="press flex h-12 items-center gap-3 text-left text-[16px] text-accent"
                >
                  <Trash2 className="size-4" />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </ChatStage>
  );
}

function AssistantMessage({ content }: { content: string }) {
  const [openThink, setOpenThink] = useState(false);
  const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/i);

  if (thinkMatch) {
    const thought = thinkMatch[1].trim();
    const cleanContent = content.replace(/<think>[\s\S]*?<\/think>/i, "").trim();

    return (
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => setOpenThink(!openThink)}
          className="press inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-md px-3.5 py-1 text-left hover:border-white/20 transition-all self-start shadow-sm"
        >
          <span className="thinking-night-wave text-[13px]">pensando…</span>
          <span className="text-[11px] text-zinc-400">
            {openThink ? "ocultar" : "mostrar raciocínio"}
          </span>
        </button>

        {openThink && (
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3 text-[13.5px] leading-relaxed text-zinc-300 italic">
            {thought}
          </div>
        )}

        {cleanContent ? (
          <Markdown text={cleanContent} className="text-[16px] leading-relaxed text-zinc-100" />
        ) : null}
      </div>
    );
  }

  return <Markdown text={content} className="text-[16px] leading-relaxed text-zinc-100" />;
}
