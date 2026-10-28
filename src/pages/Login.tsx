import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/frizzar-logo.png";

// Painel da esquerda: se houver URL, carrega em iframe (conteúdo gerenciado fora do app);
// sem URL, mostra o comunicado padrão abaixo.
const PAINEL_URL = "";

const MetaMark = ({ className = "" }: { className?: string }) => (
  <span className={`inline-flex flex-col items-center rounded-[10px] border border-border bg-white px-3.5 py-1.5 leading-tight text-[#161616] ${className}`}>
    <span className="flex items-center gap-1 text-[15px] font-bold text-[#0a7cff]">
      <svg width="20" height="13" viewBox="0 0 64 40" fill="none" stroke="#0a7cff" strokeWidth="7" strokeLinecap="round" aria-hidden="true">
        <path d="M32 20C26 8 18 4 12 4 5 4 3 13 3 20s2 16 9 16c6 0 14-4 20-16zm0 0c6 12 14 16 20 16 7 0 9-9 9-16S58 4 52 4c-6 0-14 4-20 16z" />
      </svg>
      Meta
    </span>
    <span className="text-[9px] text-muted-foreground">Tech Provider</span>
  </span>
);

function ComunicadoPadrao() {
  return (
    <div className="flex min-h-full flex-col gap-5 px-12 py-11 text-white">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Frizzar" className="h-9 brightness-0 invert" />
        <span className="font-bold text-[#ffb4a6]">+</span>
        <MetaMark />
      </div>

      <span className="self-start rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">Novidade</span>

      <h2 className="text-[40px] font-bold leading-[1.1] tracking-tight">
        A Frizzar agora é
        <br />
        <span className="text-[#ffb4a6]">parceira oficial da Meta.</span>
      </h2>
      <p className="max-w-[560px] text-[15px] leading-relaxed text-white/70">
        Com a integração à API Oficial, o Chatbot e o Connections enviam suas mensagens pelo canal oficial do WhatsApp, com mais segurança e estabilidade para o seu negócio.
      </p>

      <div className="grid grid-cols-[.9fr_1.1fr] items-center gap-7 rounded-2xl border border-white/20 bg-white/10 p-7 backdrop-blur">
        <div>
          <h3 className="text-[22px] font-bold leading-tight">
            Seu cliente conversa com <span className="text-[#ffb4a6]">um canal oficial.</span>
          </h3>
          <p className="mt-2 text-[13.5px] leading-snug text-white/70">Lembretes, confirmações e campanhas saem pela API Oficial da Meta, a empresa dona do WhatsApp.</p>
        </div>
        <div className="text-[#161616]">
          <div className="flex w-max items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3.5 shadow-md">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-white">S</span>
            <div>
              <p className="text-[13.5px] font-semibold leading-tight">Seu Salão</p>
              <p className="text-[10px] text-muted-foreground">Conta comercial · online</p>
            </div>
          </div>
          <p className="mt-2 rounded-lg bg-[#fdf3c8] px-2.5 py-1.5 text-[11px] leading-snug text-[#6a5a1a]">Esta empresa usa um serviço seguro da Meta para gerenciar esta conversa.</p>
          <p className="mt-2 rounded-xl bg-white px-3.5 py-3 text-[13px] leading-snug shadow-sm">
            Oi, Ana! Passando para lembrar do seu horário amanhã às 14h. Podemos confirmar?
            <span className="mt-0.5 block text-right text-[9px] text-muted-foreground">09:30</span>
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 rounded-[14px] border border-white/20 border-b-[3px] border-b-[#ff6b63] bg-white/10 px-5 py-[18px]">
        <div>
          <p className="text-base font-semibold">Sua comunicação pelo WhatsApp em uma nova fase.</p>
          <p className="text-[12.5px] text-white/70">Chatbot e Connections com mais segurança e estabilidade.</p>
        </div>
        <MetaMark />
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [ver, setVer] = useState(false);
  const [manter, setManter] = useState(true);

  const campo =
    "h-[42px] w-full rounded-[10px] border border-info/40 bg-white px-3.5 dark:bg-background text-sm outline-none transition focus:border-info focus:ring-[3px] focus:ring-info/20";

  return (
    <div className="fixed inset-0 z-50 grid grid-cols-1 overflow-hidden bg-white p-4 dark:bg-background lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* esquerda: embutido, com margem igual em volta; só ele rola */}
      <section
        aria-label="Novidades"
        className="hidden h-[calc(100vh-32px)] overflow-y-auto rounded-[28px] [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2 lg:block"
        style={{
          background:
            "radial-gradient(60% 45% at 85% 12%,rgba(255,170,140,.55) 0%,rgba(255,170,140,0) 70%),radial-gradient(70% 50% at 10% 100%,rgba(230,59,59,.55) 0%,rgba(230,59,59,0) 70%),linear-gradient(165deg,#2a0e16 0%,#5a1623 45%,#8d2231 100%)",
        }}
      >
        {PAINEL_URL ? <iframe src={PAINEL_URL} title="Novidades da Frizzar" className="h-full w-full border-0" /> : <ComunicadoPadrao />}
      </section>

      {/* direita: login fixo */}
      <section className="flex h-[calc(100vh-32px)] flex-col items-center overflow-hidden px-10 pt-[9vh]">
        <form
          className="w-full max-w-[320px]"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <img src={logo} alt="Frizzar" className="mx-auto mb-[34px] h-[46px]" />

          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold">
            E-mail
          </label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@seusalao.com.br" className={campo} />

          <label htmlFor="senha" className="mb-1.5 mt-[18px] block text-xs font-semibold">
            Senha
          </label>
          <div className="relative">
            <input id="senha" type={ver ? "text" : "password"} autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Sua senha" className={`${campo} pr-10`} />
            <button type="button" onClick={() => setVer((v) => !v)} aria-label={ver ? "Ocultar senha" : "Mostrar senha"} className="absolute right-1.5 top-1/2 grid h-[30px] w-[30px] -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
              {ver ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
              <input type="checkbox" checked={manter} onChange={(e) => setManter(e.target.checked)} className="accent-foreground" />
              Manter conectado
            </label>
            <Link to="/login" className="text-info hover:underline">
              Esqueci minha senha
            </Link>
          </div>

          <button type="submit" className="mt-5 h-11 w-full rounded-[10px] bg-foreground text-sm font-semibold text-background shadow-[0_8px_18px_rgba(22,22,22,.18)] transition hover:opacity-90">
            Entrar
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">ou</div>

          <button type="button" className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-border bg-white text-[13px] dark:bg-background font-medium transition hover:-translate-y-px hover:shadow-md">
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
              <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
            </svg>
            Entrar com Google
          </button>

          <p className="mt-[22px] text-center text-xs text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link to="/login" className="text-info hover:underline">
              Teste grátis
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
