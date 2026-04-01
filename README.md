# Leadpipe SDKs

Public SDKs for Leadpipe. This repository starts with one unified TypeScript client and is structured so other SDK languages can be added later without a rewrite.

## What This Is

Leadpipe exposes intent data APIs for topic discovery, audience building, and identity-linked audience results. The current public package is `@leadpipe/client` and it ships a single `Leadpipe` class for both public discovery and authenticated audience workflows.

## Repo Structure

```text
packages/
  typescript/   # @leadpipe/client
examples/       # runnable usage samples
spec/           # checked-in OpenAPI snapshot for the intent API
```

## Install

```bash
pnpm add @leadpipe/client
```

## Auth

The same client supports both modes:

```ts
import { Leadpipe } from "@leadpipe/client";

const publicClient = new Leadpipe();
const apiKeyClient = new Leadpipe({ apiKey: process.env.LEADPIPE_API_KEY });
const bearerClient = new Leadpipe({ bearerToken: process.env.LEADPIPE_BEARER_TOKEN });
```

Discovery routes are public and rate-limited. Audience routes use the same client with either `apiKey` or `bearerToken`.

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
const preview = await client.intent.audiences.preview({
  topicIds: [1234, 5678],
  minScore: 70,
  filters: {
    companyIndustry: ["Software"],
    hasBusinessEmail: true,
  },
});
```

## Create And Activate

```ts
const created = await client.intent.audiences.create({
  name: "Sales-led SaaS buyers",
  config: {
    topicIds: [1234, 5678],
    minScore: 70,
    filters: {
      companyIndustry: ["Software"],
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

If the intent spec changes, refresh the snapshot:

```bash
pnpm spec:refresh
```

## Notes

- The repo currently ships one official public SDK: `@leadpipe/client`
- `client.intent.topics.*` covers public discovery routes
- `client.intent.audiences.*` covers authenticated audience building and results
- `client.identification` is reserved for later
