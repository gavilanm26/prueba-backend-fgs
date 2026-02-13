"use client";

import { cn } from "@/lib/utils";

interface CreditStatusBadgeProps {
  status?: string;
}

export function CreditStatusBadge({ status }: CreditStatusBadgeProps) {
  const normalizedStatus = (status || "activo").toLowerCase();

  const styles: Record<string, string> = {
    active: "bg-success/10 text-success",
    activo: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    pendiente: "bg-warning/10 text-warning",
    rejected: "bg-destructive/10 text-destructive",
    rechazado: "bg-destructive/10 text-destructive",
    closed: "bg-muted text-muted-foreground",
    cerrado: "bg-muted text-muted-foreground",
  };

  const labels: Record<string, string> = {
    active: "Activo",
    activo: "Activo",
    pending: "Pendiente",
    pendiente: "Pendiente",
    rejected: "Rechazado",
    rechazado: "Rechazado",
    closed: "Cerrado",
    cerrado: "Cerrado",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[normalizedStatus] || "bg-primary/10 text-primary"
      )}
    >
      {labels[normalizedStatus] || status || "Activo"}
    </span>
  );
}
