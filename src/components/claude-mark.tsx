import { cn } from "@/lib/utils";

const SPARK_RAYS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export function ClaudeMark({
  className,
  thinking,
}: {
  className?: string;
  thinking?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn(thinking && "think-mark", className)}
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="3.15" strokeLinecap="round">
        {SPARK_RAYS.map((deg, i) => (
          <line
            key={deg}
            transform={`rotate(${deg} 32 32)`}
            x1="32"
            y1={i % 2 === 0 ? 3.5 : 10}
            x2="32"
            y2="25.5"
          />
        ))}
      </g>
    </svg>
  );
}

export function WaveformIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <rect x="3.4" y="8.2" width="2.2" height="7.6" rx="1.1" />
      <rect x="8.4" y="4.6" width="2.2" height="14.8" rx="1.1" />
      <rect x="13.4" y="7" width="2.2" height="10" rx="1.1" />
      <rect x="18.4" y="9.2" width="2.2" height="5.6" rx="1.1" />
    </svg>
  );
}

export function GhostIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 11c0-4.1 3.1-7 7-7s7 2.9 7 7v8.2c0 .5-.6.8-1 .4l-1.8-1.6-1.6 1.7a.7.7 0 0 1-1.1 0L12 17.4l-1.5 1.3a.7.7 0 0 1-1.1 0L7.8 17l-1.8 1.6c-.4.4-1 .1-1-.4V11Z" />
      <circle cx="9.2" cy="11.2" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="11.2" r="0.85" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TrayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.4 10h15.2v6.6a2 2 0 0 1-2 2H6.4a2 2 0 0 1-2-2V10Z" />
      <path d="M8.2 10V7.4A2.2 2.2 0 0 1 10.4 5.2h3.2A2.2 2.2 0 0 1 15.8 7.4V10" />
    </svg>
  );
}

export function PuzzleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.6" y="8.2" width="10.2" height="10.2" rx="2.2" />
      <rect x="10.2" y="4.6" width="10.2" height="10.2" rx="2.2" />
    </svg>
  );
}

export function BubbleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 6.6A2.6 2.6 0 0 1 7.6 4h8.8A2.6 2.6 0 0 1 19 6.6v6.2a2.6 2.6 0 0 1-2.6 2.6H11l-3.8 3.2v-3.2H7.6A2.6 2.6 0 0 1 5 12.8V6.6Z" />
    </svg>
  );
}

export function CodeGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m14.2 7-4.4 10" />
    </svg>
  );
}
