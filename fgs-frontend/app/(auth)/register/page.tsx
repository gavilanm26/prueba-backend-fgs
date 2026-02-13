"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  username: string;
  name: string;
  document: string;
  email: string;
  amount: string;
  password: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  username: "",
  name: "",
  document: "",
  email: "",
  amount: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  function handleChange(field: keyof FormData, value: string) {
    let newValue = value;

    if (field === "username") {
      newValue = value.replace(/\s/g, "");
    }

    if (field === "amount") {
      newValue = value.replace(/\D/g, "");
    }

    setForm((prev) => ({ ...prev, [field]: newValue }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.username.trim()) newErrors.username = "El usuario es requerido";
    if (!form.name.trim()) newErrors.name = "El nombre es requerido";
    if (!form.document.trim()) newErrors.document = "El documento es requerido";
    else if (isNaN(Number(form.document)))
      newErrors.document = "El documento debe ser numerico";
    if (!form.email.trim()) newErrors.email = "El email es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "El email no es valido";
    if (!form.amount.trim()) newErrors.amount = "El monto es requerido";
    else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      newErrors.amount = "El monto debe ser un numero positivo";
    if (!form.password.trim()) newErrors.password = "La contrasena es requerida";
    else if (form.password.length < 6)
      newErrors.password = "La contrasena debe tener al menos 6 caracteres";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Las contrasenas no coinciden";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await registerUser({
        username: form.username,
        name: form.name,
        document: Number(form.document),
        email: form.email,
        amount: Number(form.amount),
        password: form.password,
      });
      toast.success("Registro exitoso. Ahora puedes iniciar sesion.");
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al registrar. Intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const fields: {
    key: keyof FormData;
    label: string;
    type: string;
    placeholder: string;
  }[] = [
      {
        key: "username",
        label: "Usuario",
        type: "text",
        placeholder: "Nombre de usuario",
      },
      {
        key: "name",
        label: "Nombre completo",
        type: "text",
        placeholder: "Tu nombre completo",
      },
      {
        key: "document",
        label: "Documento",
        type: "text",
        placeholder: "Numero de documento",
      },
      {
        key: "email",
        label: "Email",
        type: "email",
        placeholder: "correo@ejemplo.com",
      },
      {
        key: "amount",
        label: "Monto inicial",
        type: "number",
        placeholder: "1000",
      },
    ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center gap-3 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <CreditCard className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold font-display tracking-tight">
          FinCredit
        </span>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-display">Crear Cuenta</CardTitle>
          <CardDescription>
            Completa tus datos para registrarte en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input
                  id={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className={
                    errors[field.key]
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                  disabled={isLoading}
                />
                {errors[field.key] && (
                  <p className="text-sm text-destructive">{errors[field.key]}</p>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contrasena</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Crea una contrasena segura"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={
                    errors.password
                      ? "border-destructive focus-visible:ring-destructive pr-10"
                      : "pr-10"
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirmar contrasena</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Repite tu contrasena"
                value={form.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                className={
                  errors.confirmPassword
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Ya tienes una cuenta? "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline transition-colors"
            >
              Inicia sesion
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
