import { useApp } from "@/lib/store";

export function ChatStage({ children }: { children: React.ReactNode }) {
  const chatBg = useApp((s) => s.prefs.chatBg);
  const currentId = useApp((s) => s.currentId);
  const conversations = useApp((s) => s.conversations);
  const customBots = useApp((s) => s.customBots);

  const conv = conversations.find((c) => c.id === currentId);
  const bot = conv?.botId ? customBots.find((b) => b.id === conv.botId) : null;
  // Use bot photo or user custom chat background
  const activeBg = bot?.photo || chatBg;

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-bg-warm">
      {activeBg ? (
        <>
          <img
            src={activeBg}
            alt={bot?.name || ""}
            className="pointer-events-none absolute inset-0 size-full object-cover"
          />
          {/* Subtle soft gradient at top and bottom for contrast with top-bar & input, without darkening the entire image */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />
        </>
      ) : null}
      <div className="relative z-10 flex h-full min-h-0 flex-col">{children}</div>
    </div>
  );
}
