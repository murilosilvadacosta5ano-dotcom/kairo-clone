import { useState, useMemo, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Pin,
  Search,
  Settings,
  SquarePen,
  User,
  UserCheck,
} from "lucide-react";
import { AnimatedFace } from "./animated-face";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const open = useApp((s) => s.sidebarOpen);
  const setSidebar = useApp((s) => s.setSidebar);
  const conversations = useApp((s) => s.conversations);
  const currentId = useApp((s) => s.currentId);
  const openConversation = useApp((s) => s.openConversation);
  const newChat = useApp((s) => s.newChat);
  const deleteConversation = useApp((s) => s.deleteConversation);
  const renameConversation = useApp((s) => s.renameConversation);
  const pinConversation = useApp((s) => s.pinConversation);
  const openSettings = useApp((s) => s.openSettings);
  const setView = useApp((s) => s.setView);
  const customBots = useApp((s) => s.customBots);
  const openBotEdit = useApp((s) => s.openBotEdit);
  const authUser = useApp((s) => s.authUser);
  const logout = useApp((s) => s.logout);
  const setPersonaSheet = useApp((s) => s.setPersonaSheet);
  const displayName = useApp((s) => s.prefs.profile.displayName);
  const userName = authUser?.name || displayName.trim() || "Usuário";

  const [searchQuery, setSearchQuery] = useState("");
  const [renameModalId, setRenameModalId] = useState<string | null>(null);
  const [renameTitleDraft, setRenameTitleDraft] = useState("");

  const formatChatTime = (timestamp?: number) => {
    if (!timestamp) return "Recente";
    const date = new Date(timestamp);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    const isYesterday =
      now.getDate() - date.getDate() === 1 &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
    if (isYesterday) return "Ontem";
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const processedConversations = useMemo(() => {
    // Only show chats that have at least 1 message in history
    const validChats = conversations.filter((c) => c.messages && c.messages.length > 0);

    // Sort pinned conversations to the top first, then by updatedAt
    const sorted = [...validChats].sort((a, b) => {
      if (Boolean(a.pinned) !== Boolean(b.pinned)) {
        return a.pinned ? -1 : 1;
      }
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });

    return sorted.map((c) => ({
      id: c.id,
      title: c.title || "Nova conversa",
      time: formatChatTime(c.updatedAt),
      pinned: Boolean(c.pinned),
      botId: c.botId,
    }));
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return processedConversations;
    const q = searchQuery.toLowerCase();
    return processedConversations.filter((c) => c.title.toLowerCase().includes(q));
  }, [processedConversations, searchQuery]);

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={() => {
          setSidebar(false);
        }}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden",
          open ? "block" : "hidden",
        )}
      />

      <aside
        className={cn(
          "sidebar-drawer fixed inset-y-0 left-0 z-50 flex w-[min(320px,86vw)] flex-col bg-[#08080c]/95 backdrop-blur-2xl text-white pt-[max(12px,env(safe-area-inset-top))] pb-[max(12px,env(safe-area-inset-bottom))] border-r border-white/10 md:w-[290px]",
          open && "is-open",
        )}
      >
        {/* Top Header: User Profile + Arrow collapse button */}
        <div className="flex items-center justify-between px-4 pb-3 pt-1 border-b border-white/5">
          <div className="relative" ref={accountMenuRef}>
            <button
              type="button"
              onClick={() => setAccountMenuOpen((prev) => !prev)}
              className="press flex items-center gap-2.5 text-left group min-w-0 py-1 px-1.5 -ml-1.5 rounded-xl hover:bg-white/[0.06] transition-all"
            >
              <div className="size-9 overflow-hidden rounded-full bg-[#0080ff] ring-1 ring-white/20 flex items-center justify-center shrink-0 shadow-sm">
                {authUser?.avatar ? (
                  <img src={authUser.avatar} alt={userName} className="size-full object-cover" />
                ) : (
                  <User className="size-5 text-white" />
                )}
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[17px] font-semibold text-white tracking-tight group-hover:text-zinc-100 truncate max-w-[130px]">
                  {userName}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-zinc-400 shrink-0 transition-transform duration-200",
                    accountMenuOpen && "rotate-180 text-white",
                  )}
                />
              </div>
            </button>

            {/* Dropdown Menu */}
            {accountMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-[265px] z-50 rounded-2xl bg-[#14151e]/98 backdrop-blur-2xl border border-white/10 p-2 shadow-[0_16px_48px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-150">
                {/* User Card info */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/5 mb-1.5">
                  <div className="size-10 overflow-hidden rounded-full bg-[#0080ff] ring-1 ring-white/20 flex items-center justify-center shrink-0">
                    {authUser?.avatar ? (
                      <img src={authUser.avatar} alt={userName} className="size-full object-cover" />
                    ) : (
                      <User className="size-5 text-white" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-semibold text-white truncate">{userName}</p>
                    <p className="text-[12px] text-zinc-400 truncate">{userEmail}</p>
                  </div>
                </div>

                {/* Action 1: Gerenciar conta Google */}
                <button
                  type="button"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    openSettings("profile");
                  }}
                  className="press flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] font-medium text-zinc-200 hover:text-white hover:bg-white/[0.08] transition-all text-left"
                >
                  <UserCheck className="size-4 text-blue-400" />
                  <span>Gerenciar conta Google</span>
                </button>

                <div className="my-1 border-t border-white/5" />

                {/* Action 2: Sair in red */}
                <button
                  type="button"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    setSidebar(false);
                    logout();
                  }}
                  className="press flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 active:bg-red-500/20 transition-all text-left"
                >
                  <LogOut className="size-4 text-red-400" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSidebar(false)}
            aria-label="Recolher menu"
            className="press flex size-9 items-center justify-center rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/10 text-zinc-300 hover:text-white transition-all shadow-sm shrink-0"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Scrollable middle area: Bots Button + Separated chat histories */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 space-y-4">
          {/* Bots button adapted to gray sidebar color without border lines, with mascot */}
          <div>
            <button
              type="button"
              onClick={() => {
                setView("bots");
                setSidebar(false);
              }}
              className="press flex w-full items-center justify-between rounded-xl bg-white/[0.06] hover:bg-white/[0.11] p-3 text-left transition-all shadow-sm group"
            >
              <div className="flex items-center gap-2.5">
                <AnimatedFace size="xs" />
                <span className="text-[14.5px] font-medium text-zinc-200 group-hover:text-white">
                  Bots
                </span>
              </div>
              <ChevronRight className="size-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </button>
          </div>

          {/* Unified Chat History (No separated Bot category header, only mascot next to bot chat names) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 pb-1.5">
              <span className="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider">
                Conversas
              </span>
            </div>

            {filteredConversations.length === 0 ? (
              <div className="px-3 py-3 text-center text-[12.5px] text-zinc-600">
                Nenhuma conversa recente
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isActive = c.id === currentId;

                return (
                  <div
                    key={c.id}
                    className={cn(
                      "group relative flex items-center rounded-xl transition-all",
                      isActive
                        ? "bg-white/[0.12] text-white shadow-sm"
                        : "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        openConversation(c.id);
                        setSidebar(false);
                      }}
                      className="flex-1 min-w-0 px-3 py-2 text-left outline-none"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {/* If it's a bot chat, show mascot before name */}
                        {c.botId && (
                          <AnimatedFace size="xs" className="shrink-0" />
                        )}

                        {c.pinned && (
                          <Pin className="size-3 text-blue-400 shrink-0 fill-blue-400" />
                        )}

                        <span
                          className={cn(
                            "truncate leading-snug min-w-0",
                            isActive
                              ? "text-[14px] font-medium text-white"
                              : "text-[13.5px] font-normal text-zinc-300",
                          )}
                        >
                          {c.title}
                        </span>

                        {/* If it's a bot chat, show mascot after name */}
                        {c.botId && (
                          <AnimatedFace size="xs" className="shrink-0" />
                        )}
                      </div>
                      <div className="mt-0.5 text-[11px] text-zinc-500">
                        {c.time}
                      </div>
                    </button>

                    {/* iOS style select for conversation actions */}
                    <div
                      className="pr-1 opacity-70 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        defaultValue=""
                        style={{ fontSize: "16px" }}
                        aria-label={`Opções de ${c.title}`}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "pin") {
                            pinConversation(c.id, !c.pinned);
                          } else if (val === "rename") {
                            setRenameModalId(c.id);
                            setRenameTitleDraft(c.title);
                          } else if (val === "edit_bot") {
                            const bot = c.botId
                              ? customBots.find((b) => b.id === c.botId)
                              : null;
                            if (bot) {
                              openBotEdit(bot);
                              setSidebar(false);
                            }
                          } else if (val === "delete") {
                            deleteConversation(c.id);
                          }
                          e.target.value = "";
                        }}
                        className="h-7 w-7 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-zinc-300 hover:text-white text-center font-bold outline-none cursor-pointer appearance-none border border-transparent hover:border-white/10"
                      >
                        <option value="" disabled hidden>
                          ···
                        </option>
                        <option value="pin" className="bg-[#181920] text-white">
                          {c.pinned ? "Desafixar do topo" : "Fixar no topo"}
                        </option>
                        {c.botId && (
                          <option value="edit_bot" className="bg-[#181920] text-white">
                            Editar bot
                          </option>
                        )}
                        <option value="rename" className="bg-[#181920] text-white">
                          Renomear
                        </option>
                        <option value="delete" className="bg-[#181920] text-red-400 font-semibold">
                          Deletar
                        </option>
                      </select>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom bar: Settings, Search bar, New Chat - clean blur without artificial tab box */}
        <div className="mt-auto flex items-center gap-2 px-3 pt-2.5 pb-1 bg-transparent backdrop-blur-sm">
          {/* Settings button */}
          <button
            type="button"
            onClick={() => openSettings()}
            aria-label="Configurações"
            className="press flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/10 text-zinc-200 hover:text-white transition-all shadow-sm"
          >
            <Settings className="size-4.5" />
          </button>

          {/* Search bar */}
          <div className="relative flex flex-1 items-center rounded-full bg-white/[0.07] hover:bg-white/[0.1] focus-within:bg-white/[0.12] border border-white/10 px-3 h-10 transition-all shadow-sm">
            <Search className="size-3.5 shrink-0 text-zinc-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              suppressHydrationWarning
              className="w-full bg-transparent text-[13.5px] text-white placeholder:text-zinc-400 outline-none"
            />
          </div>

          {/* New Chat button */}
          <button
            type="button"
            onClick={() => {
              newChat();
              setSidebar(false);
            }}
            aria-label="Novo bate-papo"
            className="press flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/10 text-zinc-200 hover:text-white transition-all shadow-sm"
          >
            <SquarePen className="size-4.5" />
          </button>
        </div>
      </aside>

      {/* Rename Dialog */}
      {renameModalId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            onClick={() => setRenameModalId(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-sm rounded-2xl bg-[#16171d] border border-white/10 p-4 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="text-[16px] font-semibold text-white mb-2">
              Renomear conversa
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (renameTitleDraft.trim()) {
                  renameConversation(renameModalId, renameTitleDraft.trim());
                }
                setRenameModalId(null);
              }}
            >
              <input
                type="text"
                autoFocus
                value={renameTitleDraft}
                onChange={(e) => setRenameTitleDraft(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-[14.5px] text-white outline-none focus:border-blue-500 mb-4"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRenameModalId(null)}
                  className="press flex-1 h-9 rounded-xl bg-white/10 hover:bg-white/15 text-[13.5px] font-medium text-zinc-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!renameTitleDraft.trim()}
                  className="press flex-1 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-[13.5px] disabled:opacity-40"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
