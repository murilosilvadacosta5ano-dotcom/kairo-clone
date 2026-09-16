import { useEffect, useState } from "react";
import { ChatStage } from "./chat-stage";
import { ClaudeMark } from "./claude-mark";
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
          <ClaudeMark className="mb-5 size-[42px] text-accent" />
          <h2 className="font-display text-center text-[32px] font-medium leading-[1.15] tracking-[-0.02em] text-fg md:text-[36px]">
            {greet}, {name}
          </h2>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl pb-[max(6px,env(safe-area-inset-bottom))]">
        <Composer />
      </div>
    </ChatStage>
  );
}
