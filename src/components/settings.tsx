import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Image as ImageIcon,
  KeyRound,
  Languages,
  LogOut,
  ScrollText,
  Shield,
  SlidersHorizontal,
  Upload,
  User,
  X,
} from "lucide-react";
import { loadRemoteModels } from "@/lib/load-models";
import { useApp, getActivePersona } from "@/lib/store";
import { PROVIDERS, USER, type AiProvider, type SettingsPage } from "@/lib/types";
import { cn, compressImage, initialsFrom } from "@/lib/utils";

const ACCOUNT = [
  { id: "profile" as const, label: "Perfil", Icon: CircleUser },
  { id: "privacy" as const, label: "Privacidade", Icon: Shield },
];

const APP = [
  { id: "background" as const, label: "Fundo do chat", Icon: ImageIcon },
  { id: "api" as const, label: "API", Icon: KeyRound },
  { id: "instructions" as const, label: "Instruções", Icon: ScrollText },
  { id: "language" as const, label: "Idioma", Icon: Languages },
];

const TITLES: Record<SettingsPage, string> = {
  index: "Configurações",
  profile: "Perfil",
  billing: "Cobrança",
  notifications: "Notificações",
  focus: "Tempo e foco",
  privacy: "Privacidade",
  shared: "Links compartilhados",
  features: "Recursos",
  connectors: "Connectors",
  permissions: "Permissões",
  appearance: "Aparência",
  language: "Idioma",
  instructions: "Instruções",
  story: "História",
  api: "API",
  background: "Fundo do chat",
  about: "Sobre",
};

export function SettingsSheet() {
  const open = useApp((s) => s.settingsOpen);
  const page = useApp((s) => s.settingsPage);
  const close = useApp((s) => s.closeSettings);
  const setPage = useApp((s) => s.setSettingsPage);
  const setInfo = useApp((s) => s.setInfo);

  if (!open) return null;

  const backTo = "index";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <button
        type="button"
        aria-label="Fechar configurações"
        className="backdrop-in absolute inset-0 bg-fg/25"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="sheet-in relative z-10 flex h-[min(860px,96dvh)] w-full max-w-[430px] flex-col overflow-hidden rounded-t-sheet bg-bg md:h-[min(820px,92dvh)] md:rounded-sheet"
        style={{ boxShadow: "var(--shadow-sheet)" }}
      >
        <header className="flex items-center justify-between px-2 pb-1 pt-2.5">
          {page === "index" ? (
            <button
              type="button"
              aria-label="Fechar"
              onClick={close}
              className="press flex size-11 items-center justify-center text-fg"
            >
              <X className="size-[22px]" strokeWidth={1.8} />
            </button>
          ) : (
            <button
              type="button"
              aria-label="Voltar"
              onClick={() => setPage(backTo)}
              className="press flex size-11 items-center justify-center text-fg"
            >
              <ChevronLeft className="size-[26px]" strokeWidth={1.8} />
            </button>
          )}
          <h1
            id="settings-title"
            className="text-[17px] font-semibold tracking-tight"
          >
            {TITLES[page]}
          </h1>
          {page === "index" ? (
            <button
              type="button"
              aria-label="Informações"
              onClick={() => setInfo(true)}
              className="press flex size-11 items-center justify-center text-fg"
            >
              <span className="flex size-[22px] items-center justify-center rounded-full border-[1.6px] border-fg text-[12px] font-semibold leading-none">
                i
              </span>
            </button>
          ) : (
            <span className="size-11" />
          )}
        </header>

        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-10">
          {page === "index" ? <IndexPage /> : <DetailPage page={page} />}
        </div>
      </div>
    </div>
  );
}

function IndexPage() {
  const setPage = useApp((s) => s.setSettingsPage);
  const resetAll = useApp((s) => s.resetAll);
  const close = useApp((s) => s.closeSettings);

  return (
    <>
      <div className="mb-4 rounded-group bg-muted px-4 py-3.5">
        <p className="truncate text-[16px] text-fg">{USER.email}</p>
      </div>

      <Section label="Conta">
        <Group>
          {ACCOUNT.map((item, i) => (
            <Row
              key={item.id}
              Icon={item.Icon}
              label={item.label}
              last={i === ACCOUNT.length - 1}
              onClick={() => setPage(item.id)}
            />
          ))}
        </Group>
      </Section>

      <Section label="App">
        <Group>
          {APP.map((item, i) => (
            <Row
              key={item.id}
              Icon={item.Icon}
              label={item.label}
              last={i === APP.length - 1}
              onClick={() => setPage(item.id)}
            />
          ))}
        </Group>
      </Section>

      <button
        type="button"
        onClick={() => {
          if (confirm("Sair e limpar conversas deste dispositivo?")) {
            resetAll();
            close();
          }
        }}
        className="press mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-group bg-muted text-[15px] font-medium text-fg"
      >
        <LogOut className="size-4" strokeWidth={1.8} />
        Sair
      </button>
      <p className="mt-4 text-center text-[12px] text-fg-subtle">Kairo · 1.0</p>
    </>
  );
}

function ProfileDetailPage() {
  const prefs = useApp((s) => s.prefs);
  const patch = useApp((s) => s.patchPrefs);
  const activePersona = getActivePersona(prefs);
  const personas = prefs.personas || [];
  const setActivePersona = useApp((s) => s.setActivePersona);
  const updatePersona = useApp((s) => s.updatePersona);
  const setPersonaSheet = useApp((s) => s.setPersonaSheet);
  const closeSettings = useApp((s) => s.closeSettings);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updatePersona(activePersona.id, { avatar: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Character / Persona Selector Header */}
      <div className="mb-4 flex flex-col items-center py-2">
        <div className="relative mb-2 size-20 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-border shadow-sm">
          {activePersona.isOriginal ? (
            <Ban className="size-8 text-fg-muted" />
          ) : activePersona.avatar ? (
            <img
              src={activePersona.avatar}
              alt={activePersona.name}
              className="size-full object-cover"
            />
          ) : (
            <span className="text-[20px] font-semibold">
              {initialsFrom(activePersona.name, USER.initials)}
            </span>
          )}

          {!activePersona.isOriginal && (
            <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity text-white cursor-pointer">
              <Upload className="size-5" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        <p className="text-[17px] font-semibold">{activePersona.name}</p>
        <p className="text-[13px] text-fg-muted">
          {activePersona.gender || "Sem gênero"} • {activePersona.age || "Idade livre"}
        </p>

        <button
          type="button"
          onClick={() => {
            closeSettings();
            setPersonaSheet(true);
          }}
          className="press mt-3 flex items-center gap-1.5 rounded-full bg-accent/15 px-3.5 py-1 text-[13px] font-medium text-accent hover:bg-accent/25 transition-all"
        >
          <SlidersHorizontal className="size-3.5" />
          Abrir aba de Personas
        </button>
      </div>

      {/* Quick Persona Switcher */}
      <div className="mb-4">
        <p className="mb-2 px-1 text-[13px] font-medium text-fg-muted">
          Trocar Personagem Ativo
        </p>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {personas.map((item) => {
            const isSelected = item.id === activePersona.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePersona(item.id)}
                className={cn(
                  "press flex items-center gap-2 rounded-full px-3 py-1.5 text-[13.5px] font-medium border transition-all shrink-0",
                  isSelected
                    ? "bg-fg text-bg border-transparent font-semibold shadow-sm"
                    : "bg-muted text-fg hover:bg-muted-2 border-border/50",
                )}
              >
                <div className="size-5 rounded-full overflow-hidden bg-muted-2 flex items-center justify-center shrink-0">
                  {item.isOriginal ? (
                    <Ban className="size-3 text-fg-muted" />
                  ) : item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="size-full object-cover" />
                  ) : (
                    <User className="size-3 text-fg-muted" />
                  )}
                </div>
                <span>{item.name}</span>
                {isSelected && <Check className="size-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      <Group>
        <Field
          label="Nome do Personagem"
          value={activePersona.name}
          placeholder="Nome"
          disabled={activePersona.isOriginal}
          onChange={(name) => {
            updatePersona(activePersona.id, { name });
            patch((prev) => ({ ...prev, profile: { ...prev.profile, displayName: name } }));
          }}
        />
        <Field
          label="Idade"
          value={activePersona.age}
          placeholder="Ex.: 18 anos"
          disabled={activePersona.isOriginal}
          onChange={(age) => {
            updatePersona(activePersona.id, { age });
            patch((prev) => ({ ...prev, profile: { ...prev.profile, age } }));
          }}
        />
        <label className="block px-4 py-3">
          <span className="mb-1 block text-[13px] text-fg-muted">Gênero</span>
          <select
            value={activePersona.gender}
            disabled={activePersona.isOriginal}
            onChange={(e) => {
              const gender = e.target.value;
              updatePersona(activePersona.id, { gender });
              patch((prev) => ({
                ...prev,
                profile: { ...prev.profile, gender },
              }));
            }}
            className="h-8 w-full bg-transparent text-[16px] outline-none disabled:opacity-50"
          >
            <option value="">Não informar</option>
            <option value="Masculino">Masculino ♂</option>
            <option value="Feminino">Feminino ♀</option>
            <option value="Não-binário">Não-binário ⚧</option>
            <option value="Outro">Outro</option>
          </select>
        </label>
      </Group>

      <p className="mb-2 mt-5 px-1 text-[13px] font-medium text-fg-muted">
        Biografia / Descrição / Personalidade
      </p>
      <textarea
        value={activePersona.bio}
        rows={5}
        disabled={activePersona.isOriginal}
        placeholder="Ex.: sou um humano comum, fraco comparado aos heróis da história."
        onChange={(e) => {
          const bio = e.target.value;
          updatePersona(activePersona.id, { bio });
          patch((prev) => ({
            ...prev,
            profile: { ...prev.profile, description: bio },
          }));
        }}
        className="min-h-28 w-full rounded-group bg-muted px-4 py-3 text-[15px] leading-relaxed outline-none disabled:opacity-50"
      />
      <p className="mt-2 px-1 text-[13px] leading-relaxed text-fg-muted">
        A IA usará sempre o nome, idade, gênero e biografia do personagem ativo quando falar com você.
      </p>
    </>
  );
}

function DetailPage({ page }: { page: SettingsPage }) {
  const prefs = useApp((s) => s.prefs);
  const patch = useApp((s) => s.patchPrefs);

  if (page === "profile") {
    return <ProfileDetailPage />;
  }

  if (page === "instructions") {
    return (
      <>
        <p className="mb-3 px-1 text-[14px] leading-relaxed text-fg-muted">
          Prompt de sistema global para chats normais. Diga como a IA deve agir fora dos bots — “seja gentil”, “responda de forma concisa e direta”, etc.
        </p>
        <textarea
          value={prefs.instructions}
          rows={10}
          placeholder="Ex.: seja gentil, prestativo, responda em português claro e aja como um assistente amigável."
          onChange={(e) => patch({ instructions: e.target.value })}
          className="min-h-48 w-full rounded-group bg-muted px-4 py-3 text-[15px] leading-relaxed outline-none"
        />
        <p className="mt-2 px-1 text-[13px] leading-relaxed text-fg-muted">
          Estas instruções só afetam as conversas normais do Kairo. Os Bots de IA usam suas próprias personalidades, cenários e modo história criados na aba Bots.
        </p>
      </>
    );
  }

  if (page === "api") {
    return <ApiPage />;
  }

  if (page === "background") {
    return <BackgroundPage />;
  }

  if (page === "privacy") {
    return (
      <Group>
        <ToggleRow
          label="Ajudar a treinar o modelo"
          hint="Conversas podem ser usadas para melhorar o Kairo"
          on={prefs.privacy.train}
          onChange={(v) =>
            patch((p) => ({ ...p, privacy: { ...p.privacy, train: v } }))
          }
        />
        <ToggleRow
          label="Melhorar o produto"
          last
          on={prefs.privacy.improve}
          onChange={(v) =>
            patch((p) => ({ ...p, privacy: { ...p.privacy, improve: v } }))
          }
        />
      </Group>
    );
  }

  if (page === "language") {
    return (
      <Group>
        <InfoRow label="Idioma do app" value="Português (Brasil)" last />
      </Group>
    );
  }

  return null;
}

function ApiPage() {
  const prefs = useApp((s) => s.prefs);
  const patch = useApp((s) => s.patchPrefs);
  const model = useApp((s) => s.model);
  const setModel = useApp((s) => s.setModel);
  const remote = useApp((s) => s.remoteModels);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [show, setShow] = useState(false);
  const provider = prefs.api.provider;
  const key = prefs.api.keys[provider] ?? "";

  async function load() {
    setLoading(true);
    setStatus("");
    const res = await loadRemoteModels();
    setLoading(false);
    if (res.ok && res.models.length) {
      setStatus(`${res.models.length} modelos encontrados`);
    } else if (!res.ok && res.error === "missing-key") {
      setStatus("Cole uma chave para listar os modelos.");
    } else if (!res.ok) {
      setStatus(`Não deu para listar (${res.error}).`);
    } else {
      setStatus("Nenhum modelo disponível.");
    }
  }

  useEffect(() => {
    void load();
  }, [provider, prefs.api.groqFreeOnly]);

  function setProvider(next: AiProvider) {
    patch((p) => ({ ...p, api: { ...p.api, provider: next } }));
  }

  function setKey(value: string) {
    patch((p) => ({
      ...p,
      api: { ...p.api, keys: { ...p.api.keys, [provider]: value } },
    }));
  }

  return (
    <>
      <p className="mb-3 px-1 text-[14px] leading-relaxed text-fg-muted">
        Cole a chave da IA que você quer usar. O seletor abaixo lista os
        modelos disponíveis nessa conta.
      </p>
      <label className="block mb-4">
        <span className="mb-1.5 block px-1 text-[13px] font-medium text-fg-muted">
          Provedor de IA
        </span>
        <div className="flex items-center rounded-group bg-muted px-3 py-2">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as AiProvider)}
            style={{ fontSize: "16px" }}
            className="w-full bg-transparent text-fg text-[16px] outline-none cursor-pointer"
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#1c1d24] text-white">
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </label>
      <label className="block">
        <span className="mb-1.5 block px-1 text-[13px] text-fg-muted">
          Chave de API · {PROVIDERS.find((p) => p.id === provider)?.label}
        </span>
        <div className="flex items-center gap-2 rounded-group bg-muted px-3">
          <input
            type={show ? "text" : "password"}
            value={key}
            autoComplete="off"
            spellCheck={false}
            placeholder={provider === "grok" ? "Opcional · xai-…" : "sk-…"}
            onChange={(e) => setKey(e.target.value)}
            className="h-12 min-w-0 flex-1 bg-transparent text-[15px] outline-none"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="press shrink-0 text-[13px] text-fg-muted"
          >
            {show ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      </label>
      {provider === "groq" ? (
        <div className="mt-3">
          <Group>
            <ToggleRow
              label="Usar modelos free"
              hint="Só o free tier do Groq, com mais uso gratuito"
              last
              on={prefs.api.groqFreeOnly}
              onChange={(groqFreeOnly) =>
                patch((p) => ({ ...p, api: { ...p.api, groqFreeOnly } }))
              }
            />
          </Group>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => void load()}
        disabled={loading}
        className="press mt-4 flex h-12 w-full items-center justify-center rounded-pill bg-ink text-[15px] font-medium text-surface disabled:opacity-50"
      >
        {loading ? "Carregando modelos…" : "Carregar modelos"}
      </button>
      {status ? (
        <p className="mt-2 px-1 text-[13px] text-fg-muted">{status}</p>
      ) : null}
      <label className="block mb-2 mt-5">
        <span className="mb-1.5 block px-1 text-[13px] font-medium text-fg-muted">
          Modelo
        </span>
        <div className="flex items-center rounded-group bg-muted px-3 py-2">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{ fontSize: "16px" }}
            className="w-full bg-transparent text-fg text-[16px] outline-none cursor-pointer"
          >
            {(remote.length ? remote : [{ id: model, name: model }]).map((m) => (
              <option key={m.id} value={m.id} className="bg-[#1c1d24] text-white">
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </label>
    </>
  );
}

function BackgroundPage() {
  const chatBg = useApp((s) => s.prefs.chatBg);
  const patch = useApp((s) => s.patchPrefs);

  function pick() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return;
      try {
        const data = await compressImage(f);
        patch({ chatBg: data });
      } catch {
        /* ignore */
      }
    };
    input.click();
  }

  return (
    <>
      <p className="mb-4 px-1 text-[14px] leading-relaxed text-fg-muted">
        Coloque uma foto da galeria no fundo do chat, no lugar do tema liso.
      </p>
      <div className="overflow-hidden rounded-group bg-muted">
        {chatBg ? (
          <img src={chatBg} alt="" className="h-44 w-full object-cover" />
        ) : (
          <div className="flex h-44 items-center justify-center text-[14px] text-fg-muted">
            Sem foto
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={pick}
        className="press mt-4 flex h-12 w-full items-center justify-center rounded-pill bg-ink text-[15px] font-medium text-surface"
      >
        Escolher da galeria
      </button>
      {chatBg ? (
        <button
          type="button"
          onClick={() => patch({ chatBg: null })}
          className="press mt-2 flex h-12 w-full items-center justify-center rounded-group bg-muted text-[15px] font-medium"
        >
          Remover foto
        </button>
      ) : null}
    </>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-5">
      <h3 className="mb-2 px-3 text-[13px] font-medium text-fg-muted">{label}</h3>
      {children}
    </section>
  );
}

function Group({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-group bg-muted">{children}</div>;
}

function Row({
  Icon,
  label,
  last,
  onClick,
}: {
  Icon: typeof CircleUser;
  label: string;
  last?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-[54px] w-full items-center gap-3.5 px-4 text-left",
        !last && "border-b border-hairline",
      )}
    >
      <Icon className="size-[22px] shrink-0 text-fg" strokeWidth={1.6} />
      <span className="flex-1 text-[17px] text-fg">{label}</span>
      <ChevronRight className="size-5 text-fg-subtle" strokeWidth={1.6} />
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block border-b border-hairline px-4 py-3">
      <span className="mb-1 block text-[13px] text-fg-muted">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full bg-transparent text-[16px] outline-none"
      />
    </label>
  );
}

function InfoRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-h-14 items-center justify-between gap-3 px-4 py-3",
        !last && "border-b border-hairline",
      )}
    >
      <span className="text-[16px] text-fg-muted">{label}</span>
      <span className="truncate text-right text-[16px] text-fg">{value}</span>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  on,
  onChange,
  last,
}: {
  label: string;
  hint?: string;
  on: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3.5",
        !last && "border-b border-hairline",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[16px] text-fg">{label}</p>
        {hint ? <p className="mt-0.5 text-[13px] text-fg-muted">{hint}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={cn(
          "relative inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer items-center rounded-full p-[2px] transition-colors duration-200 focus:outline-none",
          on ? "bg-blue-600" : "bg-zinc-700",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block size-[27px] rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out",
            on ? "translate-x-[20px]" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}
