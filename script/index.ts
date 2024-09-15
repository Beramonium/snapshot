// This script fetches all the beras and combines the owners and stakers into
// a single list, ranked by the combined count.

import * as fs from "node:fs";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client/core";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

// This is executed once very rarely, so let's optimize for legibility and convenience.
loadDevMessages();
loadErrorMessages();

const GRAPHQL_API_URL = process.env.GRAPHQL_API_URL ??
  "https://subgraph.satsuma-prod.com/17eee43efdce/beramonium--2354464/genesis-transfers-mainnet/version/v0.4.4/api";
const BLOCK_NUMBER = process.env.BLOCK_NUMBER ? parseInt(process.env.BLOCK_NUMBER) : 20429544;

const QUERY = gql`
  query MyQuery($first: Int!, $skip: Int!, $block: Block_height!) {
    beras(first: $first, skip: $skip, block: $block, orderBy: id) {
      id
      owner {
        id
      }
      staker {
        id
      }
    }
  }
`;

type Result = {
  beras: Array<{
    id: string;
    owner: { id: string };
    staker: { id: string } | null;
  }>;
};

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: GRAPHQL_API_URL,
    fetch,
  }),
});

const PAGE_SIZE = 100;

async function main() {
  const snapshot = {} as Record<string, number>;

  console.warn('> About to fetch data from block', BLOCK_NUMBER);

  for (let i = 0; i < 100; i++) {
    console.warn(`> Processing page ${i}...`);
    const result = await client.query<Result>({
      query: QUERY,
      variables: {
        first: PAGE_SIZE,
        skip: i * PAGE_SIZE,
        block: { number: BLOCK_NUMBER },
      },
    });
    // Be nice to the server (even more so in CI to avoid rate limiting)
    await new Promise((resolve) => setTimeout(resolve, process.env.CI ? 500 : 200));

    if (result.errors) {
      console.error(result.errors);
      throw new Error("Failed to fetch data");
    } else if (result.data.beras.length === 0) {
      console.warn("> No more beras.");
      break;
    }

    for (const bera of result.data.beras) {
      const increment = (id: string) => {
        snapshot[id] = (snapshot[id] || 0) + 1;
      };

      if (bera.staker?.id) {
        increment(bera.staker.id);
      } else {
        increment(bera.owner.id);
      }
    }
  }

  const sorted = Object.fromEntries(
    Object.entries(snapshot).sort(([, a], [, b]) => b - a),
  );

  fs.mkdirSync("out", { recursive: true });
  fs.writeFileSync("out/snapshot.json", JSON.stringify(sorted, null, 2));
}


try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
