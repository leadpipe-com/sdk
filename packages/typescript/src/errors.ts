export interface LeadpipeErrorOptions {
  message?: string;
  status: number;
  method: string;
  url: string;
  payload?: unknown;
}

export class LeadpipeError extends Error {
  readonly status: number;
  readonly method: string;
  readonly url: string;
  readonly payload?: unknown;

  constructor(options: LeadpipeErrorOptions) {
    super(options.message ?? `Leadpipe request failed with ${options.status}`);
    this.name = "LeadpipeError";
    this.status = options.status;
    this.method = options.method;
    this.url = options.url;
    this.payload = options.payload;
  }
}

export function describeErrorPayload(payload: unknown, fallback: string): string {
  if (typeof payload === "string") {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    for (const key of ["message", "error", "detail", "title"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim().length > 0) {
        return value;
      }
    }
  }

  return fallback;
}
