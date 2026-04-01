import { Leadpipe } from "@leadpipe/client";

async function main(): Promise<void> {
  const client = new Leadpipe({
    apiKey: process.env.LEADPIPE_API_KEY,
  });

  const response = await client.intent.audiences.preview({
    topicIds: [1234, 5678],
    filters: {
      companyIndustry: ["Software"],
      hasBusinessEmail: true,
    },
  });

  console.log(JSON.stringify(response, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
