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
    throw new Error("Need at least 2 matching topics to run the preview example");
  }

  const response = await client.intent.audiences.preview({
    topicIds: topics.data.slice(0, 2).map((topic) => topic.topicId),
    filters: {
      companyIndustry: ["software development"],
      hasBusinessEmail: true,
    },
  });

  console.log(JSON.stringify(response, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
