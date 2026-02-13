"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { useAuth } from "@/lib/auth-context";
import { listCredits, getCreditsByCustomer, type Credit } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditStatusBadge } from "@/components/credit-status-badge";
import {
  PlusCircle,
  Search,
  Loader2,
  FileText,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function CreditsPage() {
  const [searchId, setSearchId] = useState("");
  const [searchResults, setSearchResults] = useState<Credit[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { token } = useAuth();

  const {
    data: credits,
    isLoading,
    error,
  } = useSWR(token ? ["credits-list", token] : null, ([_, t]) =>
    listCredits(t)
  );

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchId.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const results = await getCreditsByCustomer(searchId.trim(), token);
      setSearchResults(Array.isArray(results) ? results : [results]);
      if ((Array.isArray(results) ? results : [results]).length === 0) {
        toast.info("No se encontraron creditos para este cliente");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al buscar creditos"
      );
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  function clearSearch() {
    setSearchId("");
    setSearchResults(null);
  }

  const displayCredits = searchResults !== null ? searchResults : credits || [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
            Creditos
          </h1>
          <p className="mt-1 text-muted-foreground">
            Consulta y administra todos los creditos registrados
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/credits/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Credito
          </Link>
        </Button>
      </div>

      <Card className="border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-display text-foreground">
            Buscar por Cliente
          </CardTitle>
          <CardDescription>
            Ingresa el ID del cliente para filtrar sus creditos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ID del cliente (ej: 123456795)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              type="submit"
              disabled={isSearching}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Buscar"
              )}
            </Button>
            {searchResults !== null && (
              <Button type="button" variant="outline" onClick={clearSearch}>
                Limpiar
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-display text-foreground">
            {searchResults !== null
              ? `Resultados para "${searchId}"`
              : "Todos los Creditos"}
          </CardTitle>
          <CardDescription>
            {searchResults !== null
              ? `${displayCredits.length} credito(s) encontrado(s)`
              : `${displayCredits.length} credito(s) en total`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && searchResults === null ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error && searchResults === null ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">
                Error al cargar creditos
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No se pudo conectar con el servidor. Verifica que los servicios
                esten activos.
              </p>
            </div>
          ) : displayCredits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-secondary p-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">
                No se encontraron creditos
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchResults !== null
                  ? "No hay creditos para este cliente"
                  : "Aun no tienes creditos registrados"}
              </p>
              {searchResults === null && (
                <Button asChild className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/credits/create">Crear Credito</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      ID
                    </th>
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
                  {displayCredits.map((credit, i) => (
                    <tr
                      key={credit.id || i}
                      className="border-b last:border-0 transition-colors hover:bg-secondary/50"
                    >
                      <td className="py-3.5 text-sm font-mono text-muted-foreground">
                        {credit.id
                          ? `#${String(credit.id).slice(0, 8)}`
                          : `#${i + 1}`}
                      </td>
                      <td className="py-3.5 text-sm font-medium text-foreground">
                        {credit.customerId}
                      </td>
                      <td className="py-3.5 text-sm text-muted-foreground">
                        {credit.purpose}
                      </td>
                      <td className="py-3.5 text-right text-sm font-medium text-foreground">
                        ${credit.amount?.toLocaleString("es-CO")}
                      </td>
                      <td className="py-3.5 text-right text-sm text-muted-foreground">
                        {credit.term} meses
                      </td>
                      <td className="py-3.5 text-right">
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
    </div>
  );
}
