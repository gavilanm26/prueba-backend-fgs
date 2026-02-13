"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Credit } from "@/lib/api-client";
import { DollarSign, FileText, Clock, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  credits: Credit[];
}

export function DashboardStats({ credits }: DashboardStatsProps) {
  const totalCredits = credits.length;
  const totalAmount = credits.reduce((sum, c) => sum + (c.amount || 0), 0);
  const avgTerm =
    totalCredits > 0
      ? Math.round(
          credits.reduce((sum, c) => sum + (c.term || 0), 0) / totalCredits
        )
      : 0;
  const activeCredits = credits.filter(
    (c) => c.status === "active" || c.status === "ACTIVE" || !c.status
  ).length;

  const stats = [
    {
      title: "Total Creditos",
      value: totalCredits.toString(),
      description: "Creditos registrados",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Monto Total",
      value: `$${totalAmount.toLocaleString("es-CO")}`,
      description: "En creditos otorgados",
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Creditos Activos",
      value: activeCredits.toString(),
      description: "Actualmente vigentes",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Plazo Promedio",
      value: `${avgTerm} meses`,
      description: "Promedio de duracion",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="border bg-card transition-all duration-300 hover:shadow-md"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display text-foreground">
                {stat.value}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
