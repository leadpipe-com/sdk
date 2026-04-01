# @leadpipe/client

Official TypeScript client for Leadpipe intent APIs.

Use `@leadpipe/client` for:
- topic discovery
- audience preview
- saved audience CRUD
- polling materialization status
- fetching paginated results
- runs, stats, and exports

## Install

```bash
npm install @leadpipe/client
```

Most real integrations should set `LEADPIPE_API_KEY`. Only topic discovery and site analysis routes can be used anonymously.

## Quickstart

```ts
import { Leadpipe } from "@leadpipe/client";

const client = new Leadpipe({ apiKey: process.env.LEADPIPE_API_KEY });

const topics = await client.intent.topics.search({ q: "crm", limit: 2 });
const topicIds = topics.data.slice(0, 2).map((topic) => topic.topicId);

const preview = await client.intent.audiences.preview({
  topicIds,
  filters: {
    companyIndustry: ["software development"],
    hasBusinessEmail: true,
  },
});

console.log(preview.data.totalCount);
```

## Auth

Use an authenticated client for audience methods:

```ts
import { Leadpipe } from "@leadpipe/client";

const client = new Leadpipe({ apiKey: process.env.LEADPIPE_API_KEY });
```

Anonymous clients are only for public discovery methods:

```ts
const publicClient = new Leadpipe();
const apiKeyClient = new Leadpipe({ apiKey: process.env.LEADPIPE_API_KEY });
const bearerClient = new Leadpipe({ bearerToken: process.env.LEADPIPE_BEARER_TOKEN });
```

Requires auth:
- `intent.audiences.preview`
- `intent.audiences.query`
- `intent.audiences.create`
- `intent.audiences.update`
- `intent.audiences.status`
- `intent.audiences.results`
- `intent.audiences.runs`
- `intent.audiences.stats`
- `intent.audiences.export`
- `intent.audiences.waitUntilReady`

## Docs

- API docs: `https://api.aws53.cloud/docs/intent-api`
- OpenAPI: `https://api.aws53.cloud/openapi-intent.json`

This package currently covers Leadpipe intent APIs only. Identification / resolution modules are not included yet.

The SDK tracks the live public API behavior. If the checked-in OpenAPI snapshot lags behind runtime for a response shape, the SDK types follow the live API until the snapshot is refreshed.
