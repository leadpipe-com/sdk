import { writeFile } from "node:fs/promises";

const url = "https://api.aws53.cloud/openapi-intent.json";
const output = new URL("../spec/openapi-intent.json", import.meta.url);

const response = await fetch(url);

if (!response.ok) {
  throw new Error(`Failed to fetch OpenAPI spec: ${response.status} ${response.statusText}`);
}

const body = await response.json();
await writeFile(output, `${JSON.stringify(body, null, 2)}\n`);
