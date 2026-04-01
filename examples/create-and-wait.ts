import { Leadpipe } from "@leadpipe/client";

async function main(): Promise<void> {
  const client = new Leadpipe({
    apiKey: process.env.LEADPIPE_API_KEY,
  });

  const created = await client.intent.audiences.create({
    name: "Sales-led SaaS buyers",
    config: {
      topicIds: [1234, 5678],
      minScore: 70,
      minTopicOverlap: 1,
      filters: {
        companyIndustry: ["Software"],
        companySize: ["51-200", "201-500"],
      },
    },
  });

  const updated = await client.intent.audiences.update(created.data.id, {
    status: "active",
  });

  const ready = await client.intent.audiences.waitUntilReady(updated.data.id, {
    timeoutMs: 600_000,
    intervalMs: 5_000,
  });

  console.log(JSON.stringify({ created, updated, ready }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
