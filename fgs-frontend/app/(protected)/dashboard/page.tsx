"use client";

import { useAuth } from "@/lib/auth-context";
import { listCredits } from "@/lib/api-client";
import useSWR from "swr";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentCredits } from "@/components/recent-credits";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    data: credits,
    isLoading,
    error,
  } = useSWR("credits-list", () => listCredits());

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
          {"Bienvenido, "}
          {user?.username || "Usuario"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Resumen de tu actividad financiera
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <DashboardStats credits={[]} />
      ) : (
        <>
          <DashboardStats credits={credits || []} />
          <RecentCredits credits={credits || []} />
        </>
      )}
    </div>
  );
}
