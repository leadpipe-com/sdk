import { Leadpipe } from "@leadpipe/client";

async function main(): Promise<void> {
  const client = new Leadpipe({
    apiKey: process.env.LEADPIPE_API_KEY,
  });

  const audienceId = process.env.LEADPIPE_AUDIENCE_ID;

  if (!audienceId) {
    throw new Error("Set LEADPIPE_AUDIENCE_ID to fetch audience results");
  }

  const status = await client.intent.audiences.status(audienceId);
  const results = await client.intent.audiences.results(audienceId, {
    limit: 25,
  });

  console.log(JSON.stringify({ status, results }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
