import { BubbleIcon, CodeGlyph, PuzzleIcon, TrayIcon } from "./claude-mark";
import { useApp } from "@/lib/store";
import { USER } from "@/lib/types";
import { cn, initialsFrom } from "@/lib/utils";

const NAV = [
  { id: "conversations" as const, label: "Conversas", Icon: BubbleIcon },
  { id: "projects" as const, label: "Projetos", Icon: TrayIcon },
  { id: "code" as const, label: "Código", Icon: CodeGlyph },
  { id: "artifacts" as const, label: "Artefatos", Icon: PuzzleIcon },
];

export function Sidebar() {
  const open = useApp((s) => s.sidebarOpen);
  const setSidebar = useApp((s) => s.setSidebar);
  const setView = useApp((s) => s.setView);
  const view = useApp((s) => s.view);
  const newChat = useApp((s) => s.newChat);
  const openSettings = useApp((s) => s.openSettings);
  const displayName = useApp((s) => s.prefs.profile.displayName);
  const initials = initialsFrom(displayName.trim() || USER.fullName, USER.initials);

  return (
    <>
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={() => setSidebar(false)}
        className={cn(
          "fixed inset-0 z-30 bg-fg/15 md:hidden",
          open ? "block" : "hidden",
        )}
      />
      <aside
        className={cn(
          "sidebar-drawer fixed inset-y-0 left-0 z-40 flex w-[min(320px,86vw)] flex-col bg-bg-warm pt-[max(10px,env(safe-area-inset-top))] md:w-[280px]",
          open && "is-open",
        )}
      >
        <div className="px-7 pb-8 pt-5">
          <h1 className="font-display text-[36px] font-medium leading-none tracking-[-0.03em] text-fg">
            Claude
          </h1>
        </div>

        <nav className="flex flex-1 flex-col gap-2.5 px-3">
          {NAV.map(({ id, label, Icon }) => {
            const active =
              view === id ||
              (id === "projects" && view === "project") ||
              (id === "artifacts" && view === "artifact");
            return (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                className={cn(
                  "press flex h-12 items-center gap-4 rounded-2xl px-4 text-[17px] text-fg",
                  active ? "bg-muted" : "hover:bg-muted/70",
                )}
              >
                <Icon className="size-[22px] shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
          <button
            type="button"
            onClick={() => openSettings()}
            aria-label="Configurações"
            className="press flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-[13px] font-medium tracking-wide text-fg"
          >
            {initials}
          </button>
          <button
            type="button"
            onClick={() => newChat()}
            className="press flex h-11 flex-1 items-center justify-center gap-1 rounded-pill bg-ink text-[15px] font-medium text-surface"
          >
            <span className="text-[18px] leading-none">+</span>
            Novo bate-papo
          </button>
        </div>
      </aside>
    </>
  );
}
