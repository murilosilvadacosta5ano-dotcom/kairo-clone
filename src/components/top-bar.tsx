import { Menu } from "lucide-react";
import { GhostIcon } from "./claude-mark";
import { useApp } from "@/lib/store";
import { modelLabel } from "@/lib/types";

export function TopBar({
  right,
}: {
  right?: React.ReactNode;
}) {
  const setSidebar = useApp((s) => s.setSidebar);
  const setModelPicker = useApp((s) => s.setModelPicker);
  const newChat = useApp((s) => s.newChat);
  const model = useApp((s) => s.model);
  const remote = useApp((s) => s.remoteModels);
  const modelName = modelLabel(model, remote);

  return (
    <header className="flex items-center gap-1 border-b border-hairline px-2 pb-1.5 pt-[max(8px,env(safe-area-inset-top))]">
      <button
        type="button"
        aria-label="Menu"
        onClick={() => setSidebar(true)}
        className="press flex size-11 shrink-0 items-center justify-center text-fg md:invisible"
      >
        <Menu className="size-6" strokeWidth={1.7} />
      </button>

      <div className="flex min-w-0 flex-1 justify-center">
        <button
          type="button"
          aria-label="Escolher modelo"
          onClick={() => setModelPicker(true)}
          className="press flex h-10 max-w-full items-center gap-2 rounded-full border border-bar-line bg-bar px-3.5 text-bar-fg"
        >
          <span className="truncate text-[15px] font-medium">{modelName}</span>
        </button>
      </div>

      {right ?? (
        <button
          type="button"
          aria-label="Bate-papo temporário"
          onClick={() => newChat({ temporary: true })}
          className="press flex size-11 shrink-0 items-center justify-center text-fg"
        >
          <GhostIcon className="size-[22px]" />
        </button>
      )}
    </header>
  );
}
