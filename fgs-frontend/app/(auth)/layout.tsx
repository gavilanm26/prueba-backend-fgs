import { CreditCard } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-foreground p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <CreditCard className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-display text-background tracking-tight">
            FinCredit
          </span>
        </div>
        <div>
          <h1 className="text-4xl font-bold font-display text-background leading-tight text-balance">
            Gestiona tus creditos de forma inteligente
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Plataforma integral para la administracion de productos financieros
            con la seguridad y confianza que necesitas.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          FinCredit &copy; {new Date().getFullYear()}. Todos los derechos
          reservados.
        </p>
      </div>
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
