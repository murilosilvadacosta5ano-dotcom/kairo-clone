import { useEffect, useRef, useState } from "react";
import { Copy, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { ChatStage } from "./chat-stage";
import { ClaudeMark, GhostIcon } from "./claude-mark";
import { Composer } from "./composer";
import { Markdown } from "./markdown";
import { TopBar } from "./top-bar";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ChatView() {
  const newChat = useApp((s) => s.newChat);
  const currentId = useApp((s) => s.currentId);
  const conversations = useApp((s) => s.conversations);
  const sending = useApp((s) => s.sending);
  const deleteConversation = useApp((s) => s.deleteConversation);
  const renameConversation = useApp((s) => s.renameConversation);
  const conv = conversations.find((c) => c.id === currentId);
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
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              aria-label="Bate-papo temporário"
              onClick={() => newChat({ temporary: true })}
              className="press flex size-11 items-center justify-center text-fg"
            >
              <GhostIcon className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Mais"
              onClick={() => setMenu(true)}
              className="press flex size-11 items-center justify-center text-fg"
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
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          {conv.messages.map((m) => (
            <div key={m.id} className="flex gap-3">
              {m.role === "assistant" ? (
                <ClaudeMark className="mt-1 size-5 shrink-0 text-accent" />
              ) : (
                <div className="mt-1 size-5 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                {m.role === "user" ? (
                  <p className="whitespace-pre-wrap text-[16.5px] leading-relaxed text-fg">
                    {m.content}
                  </p>
                ) : (
                  <Markdown
                    text={m.content}
                    className="text-[16.5px] leading-relaxed text-fg"
                  />
                )}
              </div>
            </div>
          ))}
          {sending ? (
            <div className="flex items-center gap-3">
              <ClaudeMark thinking className="size-5 text-accent" />
              <span className="text-[14px] text-fg-muted">Pensando…</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className={cn("mx-auto w-full max-w-2xl pb-[max(4px,env(safe-area-inset-bottom))]")}>
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
              <h2 className="text-[17px] font-semibold">Conversa</h2>
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
                      .map((m) => `${m.role === "user" ? "Você" : "Claude"}: ${m.content}`)
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
