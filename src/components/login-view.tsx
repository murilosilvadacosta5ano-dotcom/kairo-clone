import { useState } from "react";
import { useApp } from "@/lib/store";
import { uid } from "@/lib/utils";

export function LoginView() {
  const setAuthUser = useApp((s) => s.setAuthUser);
  const setTermsModalOpen = useApp((s) => s.setTermsModalOpen);
  const [loading, setLoading] = useState(false);
  const [customModal, setCustomModal] = useState(false);
  const [googleName, setGoogleName] = useState("Conta Google");
  const [googleEmail, setGoogleEmail] = useState("usuario@gmail.com");

  const handleGoogleLogin = (name?: string, email?: string) => {
    setLoading(true);
    setTimeout(() => {
      const finalName = name?.trim() || googleName.trim() || "Usuário Google";
      const finalEmail = email?.trim() || googleEmail.trim() || "usuario@gmail.com";
      const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        finalName,
      )}&backgroundColor=4285F4,34A853,FBBC05,EA4335&textColor=ffffff`;

      setAuthUser({
        id: uid(),
        name: finalName,
        email: finalEmail,
        avatar,
        isLoggedIn: true,
      });
      setLoading(false);
    }, 450);
  };

  return (
    <div className="relative flex h-dvh w-full flex-col items-center justify-between overflow-hidden bg-[#06070a] px-6 py-8 text-white select-none">
      {/* Background Cosmic Aurora Ring Arc (Exact match to reference photo) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[65vh] overflow-hidden"
      >
        {/* Deep blue radial glow base */}
        <div className="absolute left-1/2 top-[12%] -translate-x-1/2 size-[340px] rounded-full bg-blue-600/30 blur-[90px]" />
        
        {/* Curved luminous arch / celestial aurora ring */}
        <div
          className="absolute left-1/2 top-[8%] -translate-x-1/2 h-[380px] w-[500px] sm:w-[600px] rounded-[50%] border-[28px] border-transparent opacity-95 blur-[2px]"
          style={{
            borderTopColor: "rgba(235, 240, 255, 0.75)",
            boxShadow:
              "0 -20px 80px 10px rgba(59, 130, 246, 0.45), 0 -4px 30px 4px rgba(253, 224, 71, 0.25), inset 0 20px 60px rgba(59, 130, 246, 0.4)",
          }}
        />

        {/* Second soft amber/golden shimmer layer on the arch */}
        <div
          className="absolute left-1/2 top-[7.5%] -translate-x-1/2 h-[380px] w-[460px] sm:w-[560px] rounded-[50%] border-[18px] border-transparent opacity-70 blur-[5px]"
          style={{
            borderTopColor: "rgba(254, 240, 138, 0.55)",
          }}
        />

        {/* Subtle dark gradient overlay to blend smoothly downwards */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06070a]/40 to-[#06070a]" />
      </div>

      {/* Top spacer */}
      <div className="w-full flex justify-end pt-2">
        {/* Minimalist discreet option to customize account info if desired */}
        <button
          type="button"
          onClick={() => setCustomModal(true)}
          className="text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Opções
        </button>
      </div>

      {/* Center content container */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center my-auto pb-4">
        {/* Circular Kairo Icon with dual pause bars (||) */}
        <div className="mb-8 flex size-[74px] items-center justify-center rounded-full bg-[#1b1c22]/90 border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="h-6 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            <span className="h-6 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-[29px] font-bold tracking-tight text-white sm:text-[32px]">
          Bem-vindo ao Kairo
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-[16px] leading-relaxed text-zinc-400 max-w-[280px]">
          Seu companheiro de conversas,
          <br />
          sempre por perto.
        </p>

        {/* Login with Google Button */}
        <div className="mt-12 w-full max-w-[340px]">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleGoogleLogin()}
            className="press group relative flex h-14 w-full items-center justify-center gap-3.5 rounded-full bg-[#1f2026]/95 hover:bg-[#272830] active:scale-[0.98] border border-white/[0.12] px-6 text-white shadow-[0_12px_36px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all disabled:opacity-60"
          >
            {/* Google official 4-color SVG logo */}
            <svg
              className="size-5 shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>

            {/* Subtle vertical divider */}
            <div className="h-5 w-px bg-white/15" />

            {/* Button label */}
            <span className="text-[16px] font-medium tracking-tight text-white">
              {loading ? "Conectando..." : "Login com o Google"}
            </span>
          </button>
        </div>
      </div>

      {/* Footer disclaimer matching photo */}
      <div className="relative z-10 w-full max-w-sm text-center pb-2">
        <p className="text-[13px] leading-relaxed text-zinc-400">
          Ao continuar, você concorda com nossos
          <br />
          <button
            type="button"
            onClick={() => setTermsModalOpen(true, "terms")}
            className="font-medium text-[#3b82f6] hover:text-[#60a5fa] hover:underline"
          >
            Termos de Serviço
          </button>{" "}
          e{" "}
          <button
            type="button"
            onClick={() => setTermsModalOpen(true, "privacy")}
            className="font-medium text-[#3b82f6] hover:text-[#60a5fa] hover:underline"
          >
            Política de Privacidade
          </button>
          .
        </p>
      </div>

      {/* Optional Custom Account Modal */}
      {customModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-xs rounded-2xl bg-[#141418] border border-white/10 p-5 text-white shadow-2xl">
            <h3 className="text-[16px] font-semibold">Conta Google</h3>
            <p className="mt-1 text-[13px] text-zinc-400">
              Personalize o nome e e-mail da sua conta se desejar:
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[12px] text-zinc-400">Nome</label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-[14px] text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[12px] text-zinc-400">E-mail</label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-[14px] text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setCustomModal(false)}
                className="flex-1 rounded-xl bg-white/10 py-2 text-[13px] font-medium text-zinc-300 hover:bg-white/15"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomModal(false);
                  handleGoogleLogin(googleName, googleEmail);
                }}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-[13px] font-medium text-white hover:bg-blue-500"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
