import { useApp } from "@/lib/store";

export function ChatStage({ children }: { children: React.ReactNode }) {
  const chatBg = useApp((s) => s.prefs.chatBg);

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-bg-warm">
      {chatBg ? (
        <>
          <img
            src={chatBg}
            alt=""
            className="pointer-events-none absolute inset-0 size-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/50 via-bg/35 to-bg/65" />
        </>
      ) : null}
      <div className="relative z-10 flex h-full min-h-0 flex-col">{children}</div>
    </div>
  );
}
