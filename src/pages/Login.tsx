import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/frizzar-logo.png";

// Painel da esquerda: se houver URL, carrega em iframe (conteúdo gerenciado fora do app);
// sem URL, mostra o comunicado padrão abaixo.
const PAINEL_URL = "";

const LINK_GOOGLE_PLAY =
  "https://play.google.com/store/apps/details?id=com.frizzar";
const LINK_APP_STORE =
  "https://apps.apple.com/br/app/frizzar-sal%C3%B5es-e-equipe/id1519074462";

const GRADIENTE_CLARO =
  "radial-gradient(120% 80% at 85% 35%,#fbd9d9 0%,#fbeeee 38%,#f7f7f9 70%)";

function LojasDiscretas() {
  const chip =
    "inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 text-xs text-muted-foreground transition hover:text-foreground";
  return (
    <div className="mt-6 border-t border-border pt-5 text-center">
      <span className="mb-3 block text-xs text-muted-foreground">
        Baixe o app Frizzar
      </span>
      <div className="flex justify-center gap-2">
        <a
          href={LINK_GOOGLE_PLAY}
          target="_blank"
          rel="noreferrer"
          className={chip}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#00d4ff"
              d="M3.6 2.2c-.2.2-.4.6-.4 1v17.6c0 .4.1.7.4 1l9.7-9.8z"
            />
            <path
              fill="#00f076"
              d="M16.6 15.2l-3.3-3.3 3.3-3.3 3.9 2.2c1.1.6 1.1 1.7 0 2.3z"
            />
            <path
              fill="#ff3a44"
              d="M16.6 15.2 13.3 12l-9.7 9.8c.4.4.9.4 1.6.1z"
            />
            <path
              fill="#ffd400"
              d="M16.6 8.8 5.2 2.1c-.7-.4-1.2-.3-1.6.1l9.7 9.8z"
            />
          </svg>
          Google Play
        </a>
        <a
          href={LINK_APP_STORE}
          target="_blank"
          rel="noreferrer"
          className={chip}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M16.4 12.6c0-2.4 2-3.5 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9s-1.9-.9-3.1-.8c-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.1 1.7 2.4 3 2.4 1.2 0 1.7-.8 3.1-.8s1.8.8 3.1.8 2.1-1.2 2.9-2.3c.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.5-3.9zM14.1 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z" />
          </svg>
          App Store
        </a>
      </div>
    </div>
  );
}

const MetaMark = ({ className = "" }: { className?: string }) => (
  <span
    className={`inline-flex flex-col items-center rounded-[10px] border border-border bg-white px-3.5 py-1.5 leading-tight text-[#161616] ${className}`}
  >
    <span className="flex items-center gap-1 text-[15px] font-bold text-[#0a7cff]">
      <svg
        width="20"
        height="13"
        viewBox="0 0 64 40"
        fill="none"
        stroke="#0a7cff"
        strokeWidth="7"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M32 20C26 8 18 4 12 4 5 4 3 13 3 20s2 16 9 16c6 0 14-4 20-16zm0 0c6 12 14 16 20 16 7 0 9-9 9-16S58 4 52 4c-6 0-14 4-20 16z" />
      </svg>
      Meta
    </span>
    <span className="text-[9px] text-muted-foreground">Tech Provider</span>
  </span>
);

function ComunicadoPadrao() {
  return (
    <div className="flex min-h-full flex-col gap-5 px-12 py-11 text-[#1d1d22]">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Frizzar" className="h-9" />
        <span className="font-bold text-primary">+</span>
        <MetaMark />
      </div>

      <span className="self-start rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
        Novidade
      </span>

      <h2 className="text-[40px] font-bold leading-[1.1] tracking-tight">
        A Frizzar agora é
        <br />
        <span className="text-primary">parceira oficial da Meta.</span>
      </h2>
      <p className="max-w-[560px] text-[15px] leading-relaxed text-[#6b6e79]">
        Com a integração à API Oficial, o Chatbot e o Connections enviam suas
        mensagens pelo canal oficial do WhatsApp, com mais segurança e
        estabilidade para o seu negócio.
      </p>

      <div className="grid grid-cols-[.9fr_1.1fr] items-center gap-7 rounded-2xl border border-[#f3dede] bg-gradient-to-br from-[#fdecec] to-white p-7">
        <div>
          <h3 className="text-[22px] font-bold leading-tight">
            Seu cliente conversa com{" "}
            <span className="text-primary">um canal oficial.</span>
          </h3>
          <p className="mt-2 text-[13.5px] leading-snug text-[#7a7d88]">
            Lembretes, confirmações e campanhas saem pela API Oficial da Meta, a
            empresa dona do WhatsApp.
          </p>
        </div>
        <div className="text-[#161616]">
          <div className="flex w-max items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3.5 shadow-md">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-white">
              S
            </span>
            <div>
              <p className="text-[13.5px] font-semibold leading-tight">
                Seu Salão
              </p>
              <p className="text-[10px] text-muted-foreground">
                Conta comercial · online
              </p>
            </div>
          </div>
          <p className="mt-2 rounded-lg bg-[#fdf3c8] px-2.5 py-1.5 text-[11px] leading-snug text-[#6a5a1a]">
            Esta empresa usa um serviço seguro da Meta para gerenciar esta
            conversa.
          </p>
          <p className="mt-2 rounded-xl bg-white px-3.5 py-3 text-[13px] leading-snug shadow-sm">
            Oi, Ana! Passando para lembrar do seu horário amanhã às 14h. Podemos
            confirmar?
            <span className="mt-0.5 block text-right text-[9px] text-muted-foreground">
              09:30
            </span>
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 rounded-[14px] border border-[#f3cccc] border-b-[3px] border-b-primary bg-gradient-to-r from-white to-[#fdecec] px-5 py-[18px]">
        <div>
          <p className="text-base font-semibold">
            Sua comunicação pelo WhatsApp em uma nova fase.
          </p>
          <p className="text-[12.5px] text-[#7a7d88]">
            Chatbot e Connections com mais segurança e estabilidade.
          </p>
        </div>
        <MetaMark />
      </div>
    </div>
  );
}

function BannerMobile() {
  const [aberto, setAberto] = useState(false);
  return (
    <div
      className="m-4 mb-0 overflow-hidden rounded-2xl border border-[#f1e1e1] text-[#1d1d22] lg:hidden"
      style={{ background: GRADIENTE_CLARO }}
    >
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
      >
        <MetaMark className="!px-2.5 !py-1" />
        <span className="flex-1 text-xs leading-tight">
          <b className="block text-[13px]">Novidade</b>
          Parceira oficial da Meta
        </span>
        <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-black/5">
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${aberto ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${aberto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className={`overflow-hidden ${aberto ? "" : "invisible"}`}>
          <div className="px-4 pb-5 pt-1">
            <h2 className="text-[24px] font-bold leading-[1.1] tracking-tight">
              A Frizzar agora é{" "}
              <span className="block text-primary">
                parceira oficial da Meta.
              </span>
            </h2>
            <p className="mt-2 text-[12.5px] leading-normal text-[#6b6e79]">
              Com a integração à API Oficial, o Chatbot e o Connections enviam
              suas mensagens pelo canal oficial do WhatsApp, com mais segurança
              e estabilidade para o seu negócio.
            </p>
            <div className="mt-4 rounded-xl border border-[#f3dede] bg-gradient-to-br from-[#fdecec] to-white p-3.5">
              <p className="text-[15px] font-bold leading-tight">
                Seu cliente conversa com{" "}
                <span className="text-primary">um canal oficial.</span>
              </p>
              <p className="mt-1.5 text-[11.5px] leading-snug text-[#7a7d88]">
                Lembretes, confirmações e campanhas saem pela API Oficial da
                Meta, a empresa dona do WhatsApp.
              </p>
              <p className="mt-3 rounded-xl bg-white px-3 py-2 text-[11.5px] leading-snug text-[#161616] shadow-sm">
                Oi, Ana! Passando para lembrar do seu horário amanhã às 14h.
                Podemos confirmar?
                <span className="mt-0.5 block text-right text-[8.5px] text-muted-foreground">
                  09:30
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [ver, setVer] = useState(false);

  const campo =
    "h-10 w-full rounded-lg border border-info/50 bg-white px-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-info/60 focus:ring-2 focus:ring-info/40";

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background lg:block lg:overflow-hidden lg:p-4">
      <div className="flex min-h-full flex-1 flex-col lg:grid lg:h-[calc(100vh-32px)] lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* esquerda: embutido, com margem igual em volta; só ele rola */}
        <section
          aria-label="Novidades"
          className="hidden h-[calc(100vh-32px)] overflow-hidden rounded-[28px] border border-[#f1e1e1] lg:block"
          style={{ background: GRADIENTE_CLARO }}
        >
          {/* a rolagem fica num filho interno: a barra é fina, afastada da borda e não escapa do canto arredondado */}
          <div className="h-full overflow-y-auto [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[3px] [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-black/[.08] [&::-webkit-scrollbar-thumb]:bg-clip-padding [&::-webkit-scrollbar-track]:my-4 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-3">
            {PAINEL_URL ? (
              <iframe
                src={PAINEL_URL}
                title="Novidades da Frizzar"
                className="h-full w-full border-0"
              />
            ) : (
              <ComunicadoPadrao />
            )}
          </div>
        </section>

        {/* celular: faixa da novidade que abre o comunicado completo; o resto da página rola */}
        <BannerMobile />

        {/* direita: login fixo */}
        <section className="flex min-h-0 flex-1 flex-col items-center bg-background px-5 pb-8 pt-6 lg:h-[calc(100vh-32px)] lg:overflow-hidden lg:rounded-none lg:bg-transparent lg:px-10 lg:pb-0 lg:pt-[9vh]">
          <form
            className="w-full max-w-[320px]"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <img
              src={logo}
              alt="Frizzar"
              className="mx-auto mb-[34px] h-[46px]"
            />

            <label
              htmlFor="email"
              className="mb-1.5 block text-[13px] font-semibold"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@seusalao.com.br"
              className={campo}
            />

            <label
              htmlFor="senha"
              className="mb-1.5 mt-[18px] block text-[13px] font-semibold"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="senha"
                type={ver ? "text" : "password"}
                autoComplete="current-password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha"
                className={`${campo} pr-10`}
              />
              <button
                type="button"
                onClick={() => setVer((v) => !v)}
                aria-label={ver ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-1.5 top-1/2 grid h-[30px] w-[30px] -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
              >
                {ver ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>

            <div className="mt-3 flex justify-end text-xs">
              <Link to="/login" className="text-info hover:underline">
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              className="mt-6 h-12 w-full rounded-lg bg-[#0a0a0a] text-[15px] font-semibold text-white transition hover:bg-black/80"
            >
              Entrar
            </button>

            <LojasDiscretas />
          </form>
        </section>
      </div>
    </div>
  );
}
