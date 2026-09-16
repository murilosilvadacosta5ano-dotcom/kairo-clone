import { useEffect, useState } from "react";
import { AnimatedFace } from "./animated-face";
import { ChatStage } from "./chat-stage";
import { Composer } from "./composer";
import { TopBar } from "./top-bar";
import { useApp } from "@/lib/store";
import { USER } from "@/lib/types";
import { greetingForHour } from "@/lib/utils";

export function HomeView() {
  const [greet, setGreet] = useState("Boa tarde");
  const displayName = useApp((s) => s.prefs.profile.displayName);

  useEffect(() => {
    setGreet(greetingForHour(new Date().getHours()));
  }, []);

  const name = displayName.trim() || USER.firstName;

  return (
    <ChatStage>
      <TopBar />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6">
        <div className="greeting-in flex flex-col items-center">
          <AnimatedFace className="mb-4" size="md" lookAngle="right" />
          <h2 className="font-display text-center text-[26px] font-medium leading-[1.15] tracking-[-0.02em] text-white md:text-[28px]">
            {greet}, {name}
          </h2>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl px-2 sm:px-4 pb-[max(16px,calc(env(safe-area-inset-bottom)+12px))]">
        <Composer />
      </div>
    </ChatStage>
  );
}
