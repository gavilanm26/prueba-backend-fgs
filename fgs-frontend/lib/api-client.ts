const IDENTITY_BASE = process.env.NEXT_PUBLIC_IDENTITY_API_URL ?? "http://localhost:3001";
const PRODUCTS_BASE = process.env.NEXT_PUBLIC_PRODUCTS_API_URL ?? "http://localhost:3002";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function getAuthHeaders(token?: string | null): Record<string, string> {
  const authToken = token || getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authToken && authToken !== "undefined") {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.text();
    let message = `Error ${response.status}`;
    try {
      const parsed = JSON.parse(errorBody);
      message = parsed.message || parsed.error || message;
    } catch {
      if (errorBody) message = errorBody;
    }
    throw new Error(message);
  }
  return response.json();
}

// --- Auth endpoints ---

export interface RegisterPayload {
  username: string;
  name: string;
  document: number;
  email: string;
  amount: number;
  password: string;
}

export async function registerUser(payload: RegisterPayload) {
  const res = await fetch(`${IDENTITY_BASE}/v1/onboarding-client`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  [key: string]: unknown;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${IDENTITY_BASE}/v1/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<LoginResponse>(res);
}

// --- Credit endpoints ---

export interface CreateCreditPayload {
  customerId: string;
  purpose: string;
  amount: number;
  term: number;
}

export interface Credit {
  id?: string;
  customerId: string;
  purpose: string;
  amount: number;
  term: number;
  status?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export async function createCredit(
  payload: CreateCreditPayload,
  token?: string | null
): Promise<Credit> {
  const res = await fetch(`${PRODUCTS_BASE}/credits`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse<Credit>(res);
}

export async function listCredits(token?: string | null): Promise<Credit[]> {
  const res = await fetch(`${PRODUCTS_BASE}/credits`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return handleResponse<Credit[]>(res);
}

export async function getCreditsByCustomer(
  customerId: string,
  token?: string | null
): Promise<Credit[]> {
  const res = await fetch(`${PRODUCTS_BASE}/credits/${customerId}`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return handleResponse<Credit[]>(res);
}
