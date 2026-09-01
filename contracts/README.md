# Onchain POAPs

A permissionless, fully onchain Proof of Attendance Protocol (POAP) built on ERC1155. All metadata—including SVG artwork—lives 100% onchain using SSTORE2 for gas-efficient storage. No IPFS. No external servers. Immutable and censorship-resistant, forever.

## Features

- **Fully Onchain**: SVG artwork stored via SSTORE2, metadata generated onchain
- **Soulbound Option**: Events can be configured as non-transferable (soulbound) tokens
- **Flexible Minting**: Public minting, Merkle allowlists, or ECDSA signature-based authorization
- **Max 1 per wallet**: Enforced through all minting methods
- **Public Minting Toggle**: Creators can enable/disable public minting
- **Creator Controls**: 30-day timelock for creator functions
- **Signature Grace Period**: Signatures valid for 37 days (30 + 7 day extension)
- **Multichain Standard**: CAIP-2 compatible event IDs for cross-chain identification
- **Permissionless**: Anyone can create events, no gatekeepers


---

## Deployed Contracts

| Network | Address | Explorer |
|---------|---------|----------|
| Base Mainnet | `TBD` | [basescan.org](#) |
| Base Sepolia | `TBD` | [0xC3249356a483fbe17d5355D39105D2eA666d9de6](https://sepolia.basescan.org/address/0xC3249356a483fbe17d5355D39105D2eA666d9de6) |

*Submit a PR to add your deployment!*

---

## Quick Start

> ⚠️ **Compiler Requirement**: This contract requires the Solidity IR pipeline (`via_ir`) due to complex stack usage. All `forge` commands must include `--via-ir`.

Register a public event and mint an Onchain POAP in under 5 minutes:

```bash
# 2. Register event
cast send $POAP_BASE_SEPOLIA "registerEvent(string,string,uint256,string,bytes32,string,string,uint8)" "My Event" "Description" $(date +%s) "Location" 0x0 "<svg>...</svg>" "https://example.com" 3 --rpc-url $BASE_SEPOLIA_RPC_URL --private-key $PRIVATE_KEY

# 3. Mint Onchain POAP
cast send $POAP_BASE_SEPOLIA "mint(uint256)" 1 --rpc-url $BASE_SEPOLIA_RPC_URL --private-key $PRIVATE_KEY
```

Or using scripts (recommended):

### Register Event (Public)
Register a new public event:

```bash
forge script script/RegisterPublicEvent.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --via-ir
```

### Public Mint
Mint public event:

```bash
forge script script/MintPublic.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --via-ir
```

Or using the test suite:

```bash
# Run all tests
forge test --via-ir

# Run with gas report
forge test --gas-report --via-ir

# Run specific test
forge test --match-test test_RegisterEvent -v --via-ir

# Run with verbosity to see detailed traces:
forge test -vvv --via-ir
```

---

## Contract Architecture

### Core Functions

```solidity
// Create a new event
function registerEvent(
    string calldata name,        // Event name
    string calldata description, // Event description
    uint256 eventDate,           // Event timestamp
    string calldata location,    // Event location
    bytes32 allowlistRoot,       // Merkle root (0 = no allowlist)
    string calldata svgImage,    // Raw SVG string (stored via SSTORE2)
    string calldata externalUrl, // Project website
    uint8 flags                  // 0=private, 1=soulbound, 2=public, 3=public+soulbound
) external returns (uint256 eventId);

// Public mint (only when isPublic is true)
function mint(uint256 eventId) external;

// Allowlist mint (always available if allowlist set)
function allowlistMint(
    uint256 eventId, 
    bytes32[] calldata merkleProof
) external;

// Signature-based mint (valid for 37 days after creation)
function mintWithSignature(
    uint256 eventId, 
    bytes calldata signature
) external;

// Creator batch mint (within 30 days)
function creatorMint(
    uint256 eventId, 
    address[] calldata recipients
) external;

// Set allowlist root (creator only, within 30 days, one-time)
function updateAllowlistRoot(
    uint256 eventId, 
    bytes32 newRoot
) external;

// Toggle public minting (creator only, within 30 days)
function updateEventPublic(
    uint256 eventId, 
    bool isPublic
) external;
```

### Minting Methods

| Function | `isPublic` Check | Timelock | Use Case |
|----------|-----------------|----------|----------|
| `mint()` | ✅ Yes | ❌ No | Public drops, pausable by creator |
| `allowlistMint()` | ❌ No | ❌ No | Pre-committed attendees, always available |
| `mintWithSignature()` | ❌ No | ✅ 37 days | Live events, QR codes, 7-day grace period |
| `creatorMint()` | ❌ No | ✅ 30 days | Post-event distribution by creator |

### View Functions

```solidity
// Get CAIP-2 multichain event ID
function getMultichainEventId(uint256 eventId) external view returns (string memory);
```

### Event Structure

```solidity
struct Event {
    string name;           // Event name
    string description;    // Event description
    uint256 eventDate;     // Unix timestamp
    string location;       // Physical or virtual location
    bytes32 allowlistRoot; // Merkle root (0 = no allowlist)
    address svgImage;      // SSTORE2 pointer to Base64-encoded SVG
    address creator;       // Event creator
    uint256 createdAt;     // Registration timestamp
    string externalUrl;    // External link
    bool isSoulbound;      // Non-transferable if true
    bool isPublic;         // Public minting enabled if true
}
```

### Flags System

The `flags` parameter in `registerEvent` uses a compact encoding:

| Flag | isPublic | isSoulbound | Use Case |
|------|----------|-------------|----------|
| 0 | ❌ | ❌ | Private, transferable event |
| 1 | ❌ | ✅ | Private, soulbound event |
| 2 | ✅ | ❌ | Public, transferable event |
| 3 | ✅ | ✅ | Public, soulbound event |

## Deployment

### Prerequisites

- Solidity ^0.8.20
- OpenZeppelin Contracts v5
- Foundry or Hardhat

### Install Dependencies

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

### Deploy

```bash
forge create OnchainPOAPs --rpc-url $BASE_SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --via-ir
```

## Usage Examples (foundry)

### Deploy
Deploy the smart contract on Base Sepolia testnet:

```bash
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --via-ir
```

### Register Event (Public)
Register a new public event:

```bash
forge script script/RegisterPublicEvent.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --via-ir
```

### Public Mint
Mint public event:

```bash
forge script script/MintPublic.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --via-ir
```

### Register Event (Allowlist)
Register a new allowlist-gated event:

```bash
forge script script/RegisterAllowlistEvent.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --via-ir
```

Creator is responsible for distributing addresses/proofs to attendees.

### Allowlist Mint
Mint using an allowlist proof:

```bash
forge script script/MintWithAllowlist.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --via-ir
```

### Register Event (Signature)
Register a new signature-authorized event:

```bash
forge script script/RegisterSignatureEvent.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --via-ir
```
Creator is responsible for generating and distributing signatures to attendees.

### Signature Mint
Mint using a signature authorization:

```bash
forge script script/MintWithSignature.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --via-ir
```

### Creator Mint
Execute a creator drop mint:

```bash
forge script script/MintCreatorDrop.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --via-ir
```

### Update Allowlist Root

Update the allowlist root (only once, called by creator)

```bash
forge script script/UpdateAllowlistRoot.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --via-ir
```

### Update Public Mint Status

Update the status of the public mint (open/close)

```bash
forge script script/UpdatePublicMintStatus.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --via-ir
```

### Get Event Data

Get event data for any Onchain POAP (only-read)

```bash
forge script script/GetEventData.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL -vvvv --via-ir
```

Logs example

```
== Logs ==
  Onchain POAP # 0
  Name: Onchain POAPs
  Description: The first Onchain POAP
  Date: 1786345914
  Location: Onchain
  Creator: 0x8C2b307fD0C037561eb2958873258eFc932ADa24
  Is Soulbound?: true
  Is Public?: true
  URI: data:application/json;base64,...
  Mutichain Event Id: eip155:84532:0xc3249356a483fbe17d5355d39105d2ea666d9de6:0
```

---

**Note:** Ensure you have set the `PRIVATE_KEY`, `BASE_SEPOLIA_RPC_URL` or `BASE_RPC_URL` and all required environment variables before running these commands.

## Example usage (hardhat - no tested) 

### Register an Event

```javascript
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#000"/>
  <text x="50" y="50" text-anchor="middle" fill="#fff">ETH Global 2024</text>
</svg>`;

// Flag 3 = public + soulbound
const tx = await contract.registerEvent(
    "ETH Online Hackathon 2024",  // name
    "Proof of attendance for...", // description
    1704067200,                   // eventDate (unix timestamp)
    "Onchain",                    // location
    ethers.constants.HashZero,    // allowlistRoot (0 = no allowlist)
    svg,                          // svgImage (raw SVG, contract handles encoding)
    "https://ethglobal.com",      // externalUrl
    3                             // flags: public + soulbound
);
const receipt = await tx.wait();
const eventId = receipt.events[0].args.eventId;
```

### Public Mint

```javascript
// Anyone can mint when event isPublic
await contract.mint(eventId);
```

### Mint with Allowlist

```javascript
const proof = [...]; // Merkle proof from backend
await contract.allowlistMint(eventId, proof);
```

#### Generate Merkle Root for Allowlist

Creator is responsible for distributing addresses/proofs to users.

```javascript
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const addresses = ["0x...", "0x...", "0x..."];
const leaves = addresses.map(addr => keccak256(addr));
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = tree.getRoot();

// Get proof for an address
const leaf = keccak256(userAddress);
const proof = tree.getProof(leaf);
```

### Mint with Signature (Offchain Authorization)

Valid for 37 days after event creation (30-day timelock + 7-day grace period).

```javascript
// Creator signs offchain
const message = ethers.solidityKeccak256(
    ['uint256', 'uint256', 'address'],
    [eventId, chainId, userAddress]
);
const signature = await creatorWallet.signMessage(ethers.getBytes(message));

// User submits mint
await contract.mintWithSignature(eventId, signature);
```

Creator is responsible for generating and distributing signatures to attendees.

### Creator Controls

```javascript
// Batch mint (within 30 days)
await contract.creatorMint(eventId, [address1, address2, ...]);

// Set allowlist root (one-time only, within 30 days)
await contract.updateAllowlistRoot(eventId, merkleRoot);

// Toggle public minting (within 30 days)
await contract.updateEventPublic(eventId, false); // disable public mint
```

#### For Event Creators

- **Optimize SVGs**: Use [svgo](https://github.com/svg/svgo) to minify before submitting
- **Limit batch size**: `creatorMint` max 101 recipients per call

### Multichain Event IDs

CAIP-2 standard for cross-chain identification:

```
eip155:{chainId}:{contractAddress}:{eventId}
```

Example:
```
eip155:1:0x1234...:42
```

### Metadata Format

Fully compliant ERC1155 metadata with onchain SVG:

```json
{
  "name": "ETH Global 2024",
  "description": "Proof of attendance for...",
  "image": "data:image/svg+xml;base64,PHN2Zy...",
  "attributes": [
    {"trait_type": "Event", "value": "ETH Global 2024"},
    {"trait_type": "Location", "value": "San Francisco"},
    {"trait_type": "Date", "display_type": "date", "value": "1704067200"},
    {"trait_type": "EventId", "value": "1"},
    {"trait_type": "Multichain EventId", "value": "eip155:1:0x...:1"},
    {"trait_type": "Creator", "value": "0x..."},
    {"trait_type": "Soulbound", "value": "true"}
  ],
  "external_url": "https://ethglobal.com"
}
```

### Events

```solidity
event NewEvent(
    uint256 indexed eventId,
    string name,
    address indexed creator
);

event NewMint(
    uint256 indexed eventId,
    address indexed recipient
);

event AllowlistUpdated(uint256 indexed eventId, bytes32 newRoot);
event EventPublicUpdated(uint256 indexed eventId, bool isPublic);
```

## Security Considerations

- **Creator Timelock**: Creator functions expire 30 days after event registration
- **Signature Grace Period**: `mintWithSignature` expires after 37 days (30 + 7)
- **One-time Allowlist**: `updateAllowlistRoot` can only be called once per event
- **Public Mint Toggle**: `updateEventPublic` can pause/unpause public minting within timelock
- **Soulbound**: Non-transferable tokens cannot be moved after minting
- **Reentrancy Guard**: All mint functions protected
- **Max 1 per wallet**: Enforced across all mint methods via `hasClaimed` mapping
- **Signature Verification**: Requires valid ECDSA signature from creator

## Gas Optimization

### SSTORE2 Storage

SVGs are stored using SSTORE2 (contract-as-storage pattern), significantly reducing gas costs:

| SVG Size | Standard Storage | SSTORE2 | Savings |
|----------|---------------|---------|---------|
| 1 KB | ~200k gas | ~50k gas | 75% |
| 5 KB | ~1M gas | ~200k gas | 80% |
| 10 KB | ~2M gas | ~350k gas | 82% |

---
## Gas Limits & SVG Size

At Base's block gas limit (~30M gas), the theoretical maximum SVG size is approximately **120-150KB**.

### Calculation

**Gas costs for SSTORE2 storage:**
- ~200 gas per byte of stored data
- ~50,000-100,000 gas overhead (contract calls, encoding, etc.)

**Math:**
```
Available gas:     30,000,000
Overhead:         -    100,000
Net for storage:   29,900,000

Max bytes: 29,900,000 / 200 = ~149,500 bytes (149KB)
```

### Practical Limits

| Constraint | Limit | Notes |
|------------|-------|-------|
| Block gas limit | ~30M gas | Hard ceiling |
| Calldata size | ~128KB-256KB | RPC/provider limits |
| Practical max SVG | ~120KB | Safe buffer for overhead |
| Recommended max | ~100KB | Leaves room for other operations |

### Cost at Maximum

For a **120KB SVG** on Base:

| Gas Price | Cost |
|-----------|------|
| 0.01 gwei | ~$0.48 |
| 0.1 gwei | ~$4.80 |
| 1 gwei (congestion) | ~$48 |

### Comparison

| Chain | Max SVG | Cost (0.01 gwei) |
|-------|---------|------------------|
| Base | ~120KB | ~$0.50 |
| Ethereum | ~120KB | ~$500 |
| Arbitrum | ~120KB | ~$0.50 |

> **Recommendation:** Stay under **100KB** for reliable minting, even though Base can theoretically handle up to ~150KB.

## Dependencies

- [OpenZeppelin Contracts v5](https://github.com/OpenZeppelin/openzeppelin-contracts)

## License

MIT License - See [LICENSE](./LICENSE) for details.

## Contributing

Contributions welcome. Please open an issue or PR for any improvements.

## Acknowledgments

- OpenZeppelin for secure contract libraries
- Vectorized for Solady (SSTORE2)
- POAP.xyz for the original concept
- CAIP-2 standard for multichain identifiers
- Farcaster community for their feedback, suggestions and love

## Disclaimer

This README contains content generated with LLMs and may contain errors and/or may be inaccurate. 
