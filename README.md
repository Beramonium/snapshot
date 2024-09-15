# Daily NFT Holder Snapshot

This repository provides a daily snapshot of the holders and stakers of our Genesis NFTs. The snapshot is intended for projects and partners who wish to utilize up-to-date information about our NFT holders.

## Overview

Every day at midnight UTC, an automated script runs to:

1. **Fetch the latest safe block number**: Ensuring data consistency by using the last safe block on the Ethereum mainnet.
2. **Query the Subgraph**: Retrieving all NFTs, their owners, and stakers as of that block.
3. **Compile holder data**: Combining owners and stakers into a single list.
4. **Rank addresses**: Sorting addresses based on the number of NFTs held or staked.
5. **Generate `snapshot.json`**: Outputting the data into a JSON file committed to this repository.

## Accessing the Snapshot Data

The latest snapshot is available in the root of this repository:

- **File**: [`snapshot.json`](snapshot.json)
- **Format**: JSON object with addresses as keys and NFT counts as values.

### Sample Structure

```json
{
  "0xAbC123...": 5,
  "0xDeF456...": 3,
  "0xGhI789...": 2,
  "...": "..."
}
```

* **Key**: Ethereum address of the NFT holder or staker.
* **Value**: Total number of NFTs held or staked by that address.

## Running the script locally
### Prerequisites

Node.js: Version 18 or higher recommended.

### Execution

1. Clone the repository:
	```bash
	git clone https://github.com/Beramonium/snapshot.git
	cd snapshot
	```

2. Navigate to the script directory:

	```bash
	cd script
	```

3. Install dependencies:

	```bash
	npm install
	```

4. Set environment variables (optional):
	* **GRAPHQL_API_URL**: Set if using a different API endpoint.
	* **BLOCK_NUMBER**: Set to specify a block number.

5. Run the script:

	```bash
	npm run snapshot
	```

6. Output:
	The snapshot will be saved in `script/out/snapshot.json`.

## License

The snapshot data is dedicated to the public domain under the CC0 1.0 Universal license.

## Disclaimer

The snapshot data is provided "as is" without warranty of any kind.

## Contact Us

If you have any questions or suggestions, please reach out:

- **Twitter**: https://twitter.com/Beramonium
- **Discord**: https://discord.gg/beramonium
- **Website**: https://beramonium.io

---

<small>That's a whole lot of tech speak for a simple NFT holder snapshot, right?</small>
