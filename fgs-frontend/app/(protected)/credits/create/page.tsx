"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCredit } from "@/lib/api-client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  customerId: string;
  purpose: string;
  amount: string;
  term: string;
}

const initialFormData: FormData = {
  customerId: "",
  purpose: "",
  amount: "",
  term: "",
};

const purposes = [
  "Compra de vehiculo",
  "Compra de vivienda",
  "Libre inversion",
  "Educacion",
  "Salud",
  "Mejoras del hogar",
  "Consolidacion de deudas",
];

const termOptions = [
  { value: "12", label: "12 meses" },
  { value: "24", label: "24 meses" },
  { value: "36", label: "36 meses" },
  { value: "48", label: "48 meses" },
  { value: "60", label: "60 meses" },
  { value: "72", label: "72 meses" },
];

export default function CreateCreditPage() {
  const [form, setForm] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    if (!form.customerId.trim())
      newErrors.customerId = "El ID del cliente es requerido";
    if (!form.purpose.trim())
      newErrors.purpose = "El proposito es requerido";
    if (!form.amount.trim()) newErrors.amount = "El monto es requerido";
    else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      newErrors.amount = "El monto debe ser un numero positivo";
    if (!form.term) newErrors.term = "El plazo es requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await createCredit({
        customerId: form.customerId,
        purpose: form.purpose,
        amount: Number(form.amount),
        term: Number(form.term),
      });
      setIsSuccess(true);
      toast.success("Credito creado exitosamente");
      setTimeout(() => router.push("/credits"), 2000);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al crear el credito. Intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="rounded-full bg-success/10 p-6">
          <CheckCircle className="h-12 w-12 text-success" />
        </div>
        <h2 className="mt-6 text-2xl font-bold font-display text-foreground">
          Credito Creado
        </h2>
        <p className="mt-2 text-muted-foreground">
          Tu credito ha sido registrado exitosamente. Redirigiendo...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/credits">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Creditos
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
          Nuevo Credito
        </h1>
        <p className="mt-1 text-muted-foreground">
          Completa el formulario para solicitar un nuevo credito
        </p>
      </div>

      <Card className="border bg-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-display text-foreground">
            Datos del Credito
          </CardTitle>
          <CardDescription>
            Todos los campos son obligatorios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="customerId">ID del Cliente</Label>
              <Input
                id="customerId"
                type="text"
                placeholder="Ej: 123456795"
                value={form.customerId}
                onChange={(e) => handleChange("customerId", e.target.value)}
                className={
                  errors.customerId
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                disabled={isLoading}
              />
              {errors.customerId && (
                <p className="text-sm text-destructive">{errors.customerId}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="purpose">Proposito</Label>
              <Select
                value={form.purpose}
                onValueChange={(value) => handleChange("purpose", value)}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="purpose"
                  className={
                    errors.purpose
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }
                >
                  <SelectValue placeholder="Selecciona el proposito" />
                </SelectTrigger>
                <SelectContent>
                  {purposes.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.purpose && (
                <p className="text-sm text-destructive">{errors.purpose}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount">Monto ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="50000"
                  value={form.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  className={
                    errors.amount
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                  disabled={isLoading}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="term">Plazo</Label>
                <Select
                  value={form.term}
                  onValueChange={(value) => handleChange("term", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    id="term"
                    className={
                      errors.term
                        ? "border-destructive focus:ring-destructive"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Selecciona el plazo" />
                  </SelectTrigger>
                  <SelectContent>
                    {termOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.term && (
                  <p className="text-sm text-destructive">{errors.term}</p>
                )}
              </div>
            </div>

            {form.amount && form.term && (
              <div className="rounded-lg bg-secondary p-4">
                <h4 className="text-sm font-medium text-foreground">
                  Resumen del Credito
                </h4>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Monto</p>
                    <p className="text-sm font-medium text-foreground">
                      ${Number(form.amount).toLocaleString("es-CO")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Plazo</p>
                    <p className="text-sm font-medium text-foreground">
                      {form.term} meses
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Cuota estimada
                    </p>
                    <p className="text-sm font-medium text-primary">
                      ~$
                      {Math.round(
                        Number(form.amount) / Number(form.term)
                      ).toLocaleString("es-CO")}
                      /mes
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/credits")}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Credito"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
