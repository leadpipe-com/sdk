import { Leadpipe } from "@leadpipe/client";

async function main(): Promise<void> {
  const client = new Leadpipe();

  const response = await client.intent.topics.analyze({
    url: "https://snowflake.com",
  });

  console.log(JSON.stringify(response, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
