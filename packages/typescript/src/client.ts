import {
  LeadpipeError,
  parseErrorPayload,
} from "./errors";
import type {
  AudienceCreateInput,
  AudienceCreatedResponse,
  AudienceDeleteResponse,
  AudienceDetailResponse,
  AudienceExportParams,
  AudienceExportResponse,
  AudienceFiltersResponse,
  AudienceListResponse,
  AudienceMaterializingResponse,
  AudiencePreviewInput,
  AudiencePreviewResponse,
  AudienceQueryInput,
  AudienceQueryRequest,
  AudienceResponse,
  AudienceResultsParams,
  AudienceResultsMaterializingResponse,
  AudienceResultsResponse,
  AudienceRunsResponse,
  AudienceStatsParams,
  AudienceStatsResponse,
  AudienceStatusParams,
  AudienceStatusResponse,
  AudienceUpdateInput,
  AudienceUpdatedResponse,
  LeadpipeOptions,
  SiteTopicsResponse,
  TopMoversResponse,
  TopicCompareResponse,
  TopicInventoryFacetsResponse,
  TopicInventoryResponse,
  TopicSearchParams,
  TopicSearchResponse,
  TopicTrendResponse,
  TopicsAnalyzeInput,
  TopicsCompareInput,
  TopicsListParams,
  TopicsMoversParams,
  WaitUntilReadyOptions,
} from "./types";

type QueryValue = string | number | boolean | null | undefined;
type QueryInput = Record<string, QueryValue | readonly QueryValue[]>;

function toQueryInput<T extends object | undefined>(value: T): QueryInput | undefined {
  return value as QueryInput | undefined;
}

function appendQuery(searchParams: URLSearchParams, query?: QueryInput): void {
  if (!query) {
    return;
  }

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item));
        }
      }
      continue;
    }

    searchParams.set(key, String(value));
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function parseResponseBody(text: string): unknown {
  if (text.trim().length === 0) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

class TopicsClient {
  constructor(private readonly client: Leadpipe) {}

  list(params?: TopicsListParams): Promise<TopicInventoryResponse> {
    return this.client.request("GET", "/v1/intent/topics", { query: toQueryInput(params) });
  }

  facets(): Promise<TopicInventoryFacetsResponse> {
    return this.client.request("GET", "/v1/intent/topics/facets");
  }

  search(params: TopicSearchParams): Promise<TopicSearchResponse> {
    return this.client.request("GET", "/v1/intent/topics/search", { query: toQueryInput(params) });
  }

  trend(topicId: number): Promise<TopicTrendResponse> {
    return this.client.request("GET", `/v1/intent/topics/${topicId}/trend`);
  }

  compare(topicIds: number[]): Promise<TopicCompareResponse> {
    return this.client.request("POST", "/v1/intent/topics/compare", {
      body: { topicIds } satisfies TopicsCompareInput,
    });
  }

  movers(params?: TopicsMoversParams): Promise<TopMoversResponse> {
    return this.client.request("GET", "/v1/intent/topics/movers", { query: toQueryInput(params) });
  }

  analyze(input: TopicsAnalyzeInput): Promise<SiteTopicsResponse> {
    return this.client.request("POST", "/v1/intent/topics/analyze", { body: input });
  }
}

class AudiencesClient {
  constructor(private readonly client: Leadpipe) {}

  filters(): Promise<AudienceFiltersResponse> {
    return this.client.request("GET", "/v1/intent/audiences/filters");
  }

  preview(input: AudiencePreviewInput): Promise<AudiencePreviewResponse> {
    return this.client.request("POST", "/v1/intent/audiences/preview", { body: input });
  }

  query(input: AudienceQueryInput): Promise<AudienceResponse | AudienceMaterializingResponse> {
    return this.client.request("POST", "/v1/intent/audiences/query", {
      body: input satisfies AudienceQueryRequest,
    });
  }

  list(): Promise<AudienceListResponse> {
    return this.client.request("GET", "/v1/intent/audiences");
  }

  get(id: string): Promise<AudienceDetailResponse> {
    return this.client.request("GET", `/v1/intent/audiences/${id}`);
  }

  create(input: AudienceCreateInput): Promise<AudienceCreatedResponse> {
    return this.client.request("POST", "/v1/intent/audiences", { body: input });
  }

  update(id: string, input: AudienceUpdateInput): Promise<AudienceUpdatedResponse> {
    return this.client.request("PATCH", `/v1/intent/audiences/${id}`, { body: input });
  }

  delete(id: string): Promise<AudienceDeleteResponse> {
    return this.client.request("DELETE", `/v1/intent/audiences/${id}`);
  }

  status(id: string, params?: AudienceStatusParams): Promise<AudienceStatusResponse> {
    return this.client.request("GET", `/v1/intent/audiences/${id}/status`, { query: toQueryInput(params) });
  }

  results(
    id: string,
    params?: AudienceResultsParams,
  ): Promise<AudienceResultsResponse | AudienceResultsMaterializingResponse> {
    return this.client.request("GET", `/v1/intent/audiences/${id}/results`, {
      query: toQueryInput(params),
    });
  }

  runs(id: string): Promise<AudienceRunsResponse> {
    return this.client.request("GET", `/v1/intent/audiences/${id}/runs`);
  }

  stats(id: string, params?: AudienceStatsParams): Promise<AudienceStatsResponse> {
    return this.client.request("GET", `/v1/intent/audiences/${id}/stats`, { query: toQueryInput(params) });
  }

  export(id: string, params?: AudienceExportParams): Promise<AudienceExportResponse> {
    return this.client.request("POST", `/v1/intent/audiences/${id}/export`, {
      query: toQueryInput(params),
    });
  }

  async waitUntilReady(audienceId: string, options: WaitUntilReadyOptions = {}): Promise<AudienceStatusResponse> {
    const intervalMs = options.intervalMs ?? 2_500;
    const timeoutMs = options.timeoutMs ?? 10 * 60_000;
    const startedAt = Date.now();

    while (true) {
      if (options.signal?.aborted) {
        throw new Error("Leadpipe waitUntilReady was aborted");
      }

      const status = await this.status(audienceId, options.date ? { date: options.date } : undefined);
      const current = status.data.status;

      if (current === "ready") {
        return status;
      }

      if (current === "failed") {
      throw new LeadpipeError({
        code: "RUN_FAILED",
        status: 409,
        method: "GET",
        url: `/v1/intent/audiences/${audienceId}/status`,
        message: `Audience ${audienceId} failed to materialize`,
        payload: status,
        });
      }

      if (Date.now() - startedAt >= timeoutMs) {
      throw new LeadpipeError({
        code: "TIMEOUT",
        status: 408,
        method: "GET",
        url: `/v1/intent/audiences/${audienceId}/status`,
        message: `Timed out waiting for audience ${audienceId} to become ready`,
      });
      }

      await sleep(intervalMs);
    }
  }
}

export class Leadpipe {
  readonly intent: {
    readonly topics: TopicsClient;
    readonly audiences: AudiencesClient;
  };

  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly apiKey: string | undefined;
  private readonly bearerToken: string | undefined;

  constructor(options: LeadpipeOptions = {}) {
    if (options.apiKey && options.bearerToken) {
      throw new Error("Leadpipe accepts either apiKey or bearerToken, not both");
    }

    const fetchImpl = options.fetch ?? globalThis.fetch;
    if (!fetchImpl) {
      throw new Error("Leadpipe requires a fetch implementation");
    }

    this.baseUrl = options.baseUrl ?? "https://api.aws53.cloud";
    this.fetchImpl = fetchImpl;
    this.apiKey = options.apiKey;
    this.bearerToken = options.bearerToken;

    this.intent = {
      topics: new TopicsClient(this),
      audiences: new AudiencesClient(this),
    };
  }

  async request<T>(
    method: string,
    path: string,
    options: { body?: unknown | undefined; query?: QueryInput | undefined } = {},
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);
    appendQuery(url.searchParams, options.query);

    const headers = new Headers();
    headers.set("accept", "application/json");

    if (this.bearerToken) {
      headers.set("authorization", `Bearer ${this.bearerToken}`);
    } else if (this.apiKey) {
      headers.set("X-API-Key", this.apiKey);
    }

    let body: string | undefined;
    if (options.body !== undefined) {
      headers.set("content-type", "application/json");
      body = JSON.stringify(options.body);
    }

    const init: RequestInit = {
      method,
      headers,
    };

    if (body !== undefined) {
      init.body = body;
    }

    const response = await this.fetchImpl(url, init);

    const text = await response.text();
    const parsed = parseResponseBody(text);

    if (!response.ok) {
      const error = parseErrorPayload(parsed, `${method} ${url.pathname} failed with ${response.status}`);

      throw new LeadpipeError({
        ...(error.code ? { code: error.code } : {}),
        status: response.status,
        method,
        url: url.toString(),
        payload: parsed,
        message: error.message,
      });
    }

    if (response.status === 204 || text.trim().length === 0) {
      return undefined as T;
    }

    return parsed as T;
  }
}

export type {
  AudienceCreateInput,
  AudienceCreatedResponse,
  AudienceDeleteResponse,
  AudienceDetailResponse,
  AudienceExportParams,
  AudienceExportResponse,
  AudienceFiltersResponse,
  AudienceListResponse,
  AudienceMaterializingResponse,
  AudiencePreviewInput,
  AudiencePreviewResponse,
  AudienceQueryInput,
  AudienceResponse,
  AudienceRecord,
  AudienceResultsParams,
  AudienceResultsMaterializingResponse,
  AudienceResultsResponse,
  AudienceRunsResponse,
  AudienceStatsParams,
  AudienceStatsResponse,
  AudienceStatusParams,
  AudienceStatusResponse,
  AudienceUpdateInput,
  AudienceUpdatedResponse,
  LeadpipeOptions,
  SiteTopicsResponse,
  TopMoversResponse,
  TopicCompareResponse,
  TopicInventoryFacetsResponse,
  TopicInventoryResponse,
  TopicSearchParams,
  TopicSearchResponse,
  TopicTrendResponse,
  TopicsAnalyzeInput,
  TopicsCompareInput,
  TopicsListParams,
  TopicsMoversParams,
  WaitUntilReadyOptions,
} from "./types";
