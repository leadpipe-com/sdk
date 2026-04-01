export interface LeadpipeErrorOptions {
  message?: string;
  code?: string;
  status: number;
  method: string;
  url: string;
  payload?: unknown;
}

export class LeadpipeError extends Error {
  readonly code: string | undefined;
  readonly status: number;
  readonly method: string;
  readonly url: string;
  readonly payload?: unknown;

  constructor(options: LeadpipeErrorOptions) {
    super(options.message ?? `Leadpipe request failed with ${options.status}`);
    this.name = "LeadpipeError";
    this.code = options.code;
    this.status = options.status;
    this.method = options.method;
    this.url = options.url;
    this.payload = options.payload;
  }
}

export interface ParsedLeadpipeError {
  code: string | undefined;
  message: string;
}

export function parseErrorPayload(payload: unknown, fallback: string): ParsedLeadpipeError {
  if (typeof payload === "string") {
    return { code: undefined, message: payload };
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    const nested = record.error;
    if (nested && typeof nested === "object") {
      const errorRecord = nested as Record<string, unknown>;
      const nestedMessage = typeof errorRecord.message === "string" ? errorRecord.message.trim() : "";
      const nestedCode = typeof errorRecord.code === "string" ? errorRecord.code.trim() : "";

      if (nestedMessage.length > 0) {
        return {
          code: nestedCode.length > 0 ? nestedCode : undefined,
          message: nestedMessage,
        };
      }
    }

    for (const key of ["message", "error", "detail", "title"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim().length > 0) {
        return { code: undefined, message: value };
      }
    }
  }

  return { code: undefined, message: fallback };
}
