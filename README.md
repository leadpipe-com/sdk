# Leadpipe SDKs

Public SDKs for Leadpipe. This repository starts with one unified TypeScript client and is structured so other SDK languages can be added later without a rewrite.

## What This Is

Leadpipe exposes intent data APIs for topic discovery, audience building, materialized audience results, runs, stats, and exports. The current public package is `@leadpipe/client` and it ships a single `Leadpipe` class for both anonymous discovery and authenticated audience workflows.

## Repo Structure

```text
packages/
  typescript/   # @leadpipe/client
examples/       # runnable usage samples
spec/           # checked-in OpenAPI snapshot for the intent API
```

## Install

```bash
npm install @leadpipe/client
```

or

```bash
pnpm add @leadpipe/client
```

## Auth

The same client supports both modes, but they are not interchangeable:

```ts
import { Leadpipe } from "@leadpipe/client";

const publicClient = new Leadpipe();
const apiKeyClient = new Leadpipe({ apiKey: process.env.LEADPIPE_API_KEY });
const bearerClient = new Leadpipe({ bearerToken: process.env.LEADPIPE_BEARER_TOKEN });
```

Use `new Leadpipe()` only for public discovery routes:
- `client.intent.topics.list()`
- `client.intent.topics.facets()`
- `client.intent.topics.search()`
- `client.intent.topics.trend()`
- `client.intent.topics.compare()`
- `client.intent.topics.movers()`
- `client.intent.topics.analyze()`

Use `apiKey` or `bearerToken` for anything audience-related:
- `client.intent.audiences.preview()`
- `client.intent.audiences.query()`
- `client.intent.audiences.create()`
- `client.intent.audiences.update()`
- `client.intent.audiences.status()`
- `client.intent.audiences.results()`
- `client.intent.audiences.runs()`
- `client.intent.audiences.stats()`
- `client.intent.audiences.export()`
- `client.intent.audiences.waitUntilReady()`

Most developers should use an API key. Anonymous usage is mainly for topic discovery and site analysis.

## Quickstart

```ts
import { Leadpipe } from "@leadpipe/client";

const client = new Leadpipe({ apiKey: process.env.LEADPIPE_API_KEY });

const topics = await client.intent.topics.list({ type: "b2b", q: "data platform" });
console.log(topics.data.slice(0, 3));
```

## Topic Discovery

```ts
const facets = await client.intent.topics.facets();
const search = await client.intent.topics.search({ q: "data platform", limit: 10 });
const trend = await client.intent.topics.trend(1234);
const compare = await client.intent.topics.compare([1234, 5678]);
const movers = await client.intent.topics.movers({ direction: "up", limit: 10 });
const analysis = await client.intent.topics.analyze({ url: "https://snowflake.com" });
```

## Audience Preview

```ts
const topicSearch = await client.intent.topics.search({ q: "crm", limit: 2 });
const topicIds = topicSearch.data.slice(0, 2).map((topic) => topic.topicId);

const preview = await client.intent.audiences.preview({
  topicIds,
  minScore: 70,
  filters: {
    companyIndustry: ["software development"],
    hasBusinessEmail: true,
  },
});
```

## Create And Activate

```ts
const topicSearch = await client.intent.topics.search({ q: "crm", limit: 2 });
const topicIds = topicSearch.data.slice(0, 2).map((topic) => topic.topicId);

const created = await client.intent.audiences.create({
  name: "Sales-led SaaS buyers",
  config: {
    topicIds,
    minScore: 70,
    filters: {
      companyIndustry: ["software development"],
    },
  },
});

const updated = await client.intent.audiences.update(created.data.id, {
  status: "active",
});
```

## Poll Status

```ts
const ready = await client.intent.audiences.waitUntilReady(updated.data.id, {
  timeoutMs: 600_000,
  intervalMs: 5_000,
});
```

## Fetch Results

```ts
const status = await client.intent.audiences.status(updated.data.id);
const results = await client.intent.audiences.results(updated.data.id, {
  limit: 25,
});
```

## Export

```ts
const exportJob = await client.intent.audiences.export(updated.data.id);
console.log(exportJob.data.downloadUrl);
```

## How This SDK Is Derived

The package is based on the Leadpipe intent OpenAPI snapshot in `spec/openapi-intent.json` and validated against the live API at `https://api.aws53.cloud/openapi-intent.json`. The client is intentionally thin: routes, request bodies, and response types are mapped directly from the public contract, with no codegen-heavy runtime layer.

The SDK favors the live public API behavior when the checked-in OpenAPI snapshot lags behind runtime for a response shape. Refresh the snapshot when the public contract changes.

If the intent spec changes, refresh the snapshot:

```bash
pnpm spec:refresh
```

## Notes

- The repo currently ships one official public SDK: `@leadpipe/client`
- `client.intent.topics.*` covers public discovery routes
- `client.intent.audiences.*` covers authenticated audience building and results
- identification / resolution modules are not part of the current SDK yet
