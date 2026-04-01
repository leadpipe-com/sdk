import { Leadpipe } from "@leadpipe/client";

async function main(): Promise<void> {
  const client = new Leadpipe({
    apiKey: process.env.LEADPIPE_API_KEY,
  });

  const topics = await client.intent.topics.search({
    q: "crm",
    limit: 2,
  });

  if (topics.data.length < 2) {
    throw new Error("Need at least 2 matching topics to create the sample audience");
  }

  const created = await client.intent.audiences.create({
    name: "Sales-led SaaS buyers",
    config: {
      topicIds: topics.data.slice(0, 2).map((topic) => topic.topicId),
      minScore: 70,
      minTopicOverlap: 1,
      filters: {
        companyIndustry: ["software development"],
        companySize: ["51 to 100", "101 to 250"],
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
