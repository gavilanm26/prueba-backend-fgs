"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Credit } from "@/lib/api-client";
import { ArrowRight, PlusCircle } from "lucide-react";
import { CreditStatusBadge } from "@/components/credit-status-badge";

interface RecentCreditsProps {
  credits: Credit[];
}

export function RecentCredits({ credits }: RecentCreditsProps) {
  const recentCredits = credits.slice(0, 5);

  return (
    <Card className="border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-display text-foreground">
            Creditos Recientes
          </CardTitle>
          <CardDescription>
            Tus ultimos creditos registrados en la plataforma
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/credits">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/credits/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentCredits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-secondary p-4">
              <PlusCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Sin creditos aun
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Crea tu primer credito para comenzar
            </p>
            <Button asChild className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/credits/create">Crear Credito</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Cliente
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Proposito
                  </th>
                  <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Monto
                  </th>
                  <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Plazo
                  </th>
                  <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentCredits.map((credit, i) => (
                  <tr
                    key={credit.id || i}
                    className="border-b last:border-0 transition-colors hover:bg-secondary/50"
                  >
                    <td className="py-3 text-sm font-medium text-foreground">
                      {credit.customerId}
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {credit.purpose}
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-foreground">
                      ${credit.amount?.toLocaleString("es-CO")}
                    </td>
                    <td className="py-3 text-right text-sm text-muted-foreground">
                      {credit.term} meses
                    </td>
                    <td className="py-3 text-right">
                      <CreditStatusBadge status={credit.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
