// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/token/ERC1155/ERC1155.sol";
import "@openzeppelin/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/utils/Base64.sol";
import "@openzeppelin/utils/ReentrancyGuard.sol";
import "@openzeppelin/utils/Strings.sol";
import "@openzeppelin/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/utils/cryptography/ECDSA.sol";
import "@openzeppelin/utils/cryptography/MessageHashUtils.sol";
import {SSTORE2} from "./SSTORE2.sol";

/**
 * @title Onchain POAPs
 * @notice Permissionless POAP (Proof of attendance protocol) with full onchain SVG metadata.
 * @dev Event ID == token ID. Multichain Event ID follows CAIP-2 standard: eip155:{chainId}:{contractAddress}:{eventId}
 * @author J. Valeska
 */
contract OnchainPOAPs is ERC1155, ERC1155Supply, ReentrancyGuard {
    using Strings for uint256;
    using Strings for address;
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // ============ Errors ============
    
    /// @notice Thrown when a parameter value is invalid
    /// @param field The name of the invalid field
    error POAP__InvalidValue(string field);
    /// @notice Thrown when the creator time lock has expired
    error POAP__TimeLockExpired();
    /// @notice Thrown when the caller is not the event creator
    error POAP__OnlyCreator();
    /// @notice Thrown when a user has already claimed the POAP
    error POAP__AlreadyClaimed();
    /// @notice Thrown when attempting to mint a non-public event
    error POAP__EventNotPublic();
    /// @notice Thrown when attempting to mint a non-allowlist event
    error POAP__AllowlistNotEnabled();
    /// @notice Thrown when attempting to update an already set allowlist root
    error POAP__RootAlreadySet();
    /// @notice Thrown when attempting to transfer a soulbound token
    error POAP__SoulboundNotTransferable();

    // ============ Constants ============
    
    /// @notice Duration of the creator control period (30 days)
    uint256 public immutable CREATOR_TIMELOCK = 30 days;

    // ============ Structs ============
    
    /**
     * @notice Represents a POAP event
     * @dev Stored permanently onchain with all metadata
     */
    struct Event {
        string name;           /// @notice Event name
        string description;    /// @notice Event description
        uint256 eventDate;     /// @notice Unix timestamp of the event
        string location;       /// @notice Physical or virtual location
        bytes32 allowlistRoot; /// @notice Merkle root for allowlist (0 if disabled)
        address svgImage;      /// @notice SSTORE2 pointer to Base64-encoded SVG
        address creator;       /// @notice Address that created the event
        uint256 createdAt;     /// @notice Block timestamp when event was registered
        string externalUrl;    /// @notice External event link
        bool isSoulbound;      /// @notice Whether tokens are non-transferable
        bool isPublic;         /// @notice Whether public minting is enabled
    }

    // ============ State ============
    
    /// @notice Mapping from event ID to Event data
    mapping(uint256 => Event) public events;
    /// @notice Mapping tracking which addresses have claimed each event
    mapping(uint256 => mapping(address => bool)) public hasClaimed;    
    /// @notice Total number of events registered (event IDs are 1-indexed, 0 is genesis)    
    uint256 public totalEvents;

    // ============ Events ============

    /// @notice Emitted when a new event is registered
    /// @param eventId The unique ID of the newly created event
    /// @param name The name of the event
    /// @param creator The address that registered the event
    event NewEvent(
        uint256 indexed eventId,
        string name,
        address indexed creator
    );

    /// @notice Emitted when a POAP is minted
    /// @param eventId The ID of the event being claimed
    /// @param recipient The address receiving the POAP    
    event NewMint(
        uint256 indexed eventId,
        address indexed recipient
    );
 
    /// @notice Emitted when an event's allowlist is updated
    /// @param eventId The ID of the event
    /// @param newRoot The new Merkle root   
    event AllowlistUpdated(uint256 indexed eventId, bytes32 newRoot);

    /// @notice Emitted when an event's public status is toggled
    /// @param eventId The ID of the event
    /// @param isPublic The new public status    
    event EventPublicUpdated(uint256 indexed eventId, bool isPublic);

    // ============ Modifiers ============

    /**
     * @notice Restricts function to before the time lock expires
     * @param eventId The ID of the event to check
     * @param extraTime Additional time beyond the standard 30 days
     */
    modifier onlyBeforeLock(uint256 eventId, uint256 extraTime) {
        if (
            events[eventId].createdAt + CREATOR_TIMELOCK + extraTime < block.timestamp
        ) revert POAP__TimeLockExpired();
        _;
    }

    /**
     * @notice Restricts function to the event creator only
     * @param eventId The ID of the event
     */
    modifier onlyCreator(uint256 eventId) {
        if (msg.sender != events[eventId].creator) revert POAP__OnlyCreator();
        _;
    }

    // ============ Constructor ============

    /**
     * @notice Deploys the contract and creates the genesis POAP (event ID 0)
     * @param svgImage The SVG image for the genesis POAP
     * @dev Emits NewEvent for genesis POAP
     */    
    constructor(string memory svgImage) ERC1155("Onchain POAPs") {        
        bytes memory svgBase64 = bytes(Base64.encode(bytes(svgImage)));
        address svgPointer = SSTORE2.write(svgBase64);

        // Register the first Onchain POAP with eventId 0        
        events[0] = Event({
            name: "Onchain POAPs",
            description: "The first Onchain POAP",
            eventDate: block.timestamp,
            location: "Onchain",
            allowlistRoot: bytes32(0),
            svgImage: svgPointer,
            creator: msg.sender,
            createdAt: block.timestamp,
            externalUrl: "",
            isSoulbound: true,
            isPublic: true
        });

        emit NewEvent(0, events[0].name, msg.sender);        
    }

    // ============ Core Functions ============

    /**
     * @notice Registers a new POAP event
     * @param name Required event name (1-128 characters)
     * @param description Optional event description (max 512 characters)
     * @param eventDate Optional unix timestamp of the event
     * @param location Optional event location (max 128 characters)
     * @param allowlistRoot Merkle root for allowlist, or bytes32(0) to disable
     * @param svgImage Required SVG string (will be Base64 encoded and stored via SSTORE2)
     * @param externalUrl Optional external URL (max 128 characters)
     * @param flags Bit flags: 0=no public & no soulbound, 1=soulbound, 2=public, 3=public & soulbound
     * @return eventId The newly assigned event ID
     * @dev Emits NewEvent on success
     */
    function registerEvent(
        string calldata name,
        string calldata description,
        uint256 eventDate,
        string calldata location,
        bytes32 allowlistRoot,
        string calldata svgImage,
        string calldata externalUrl,
        // flags 
        // 0 = No Public & No Soulbond; 1 = isSoulbound, 
        // 2 = isPublic, 3 = isSoulbound & isPublic
        uint8 flags
    ) external returns (uint256 eventId) {
        if (bytes(name).length == 0 || bytes(name).length > 128) revert POAP__InvalidValue("name");
        if (bytes(description).length > 512) revert POAP__InvalidValue("description");
        if (bytes(svgImage).length == 0) revert POAP__InvalidValue("svg");
        if (bytes(location).length > 128) revert POAP__InvalidValue("location");
        if (bytes(externalUrl).length > 128) revert POAP__InvalidValue("url");
        if (flags > 3) revert POAP__InvalidValue("flags");
        
        bool isSoulbound = flags == 1 || flags == 3;
        bool isPublic = flags == 2 || flags == 3;
        
        eventId = ++totalEvents;

        bytes memory svgBase64 = bytes(Base64.encode(bytes(svgImage)));
        address svgPointer = SSTORE2.write(svgBase64);
        
        events[eventId] = Event({
            name: name,
            description: description,
            eventDate: eventDate,
            location: location,
            allowlistRoot: allowlistRoot,
            svgImage: svgPointer,
            creator: msg.sender,
            createdAt: block.timestamp,
            externalUrl: externalUrl,
            isSoulbound: isSoulbound,
            isPublic: isPublic
        });

        emit NewEvent(eventId, name, msg.sender);
    }

    /**
     * @notice Mints a POAP for a public event
     * @param eventId The ID of the event to mint
     * @dev Requires event to be public and caller to not have claimed already
     * @dev Emits NewMint on success
     */
    function mint(
        uint256 eventId
    ) external nonReentrant {
        if (eventId > totalEvents) revert POAP__InvalidValue("eventId");
        if (!events[eventId].isPublic) revert POAP__EventNotPublic();

        if (hasClaimed[eventId][msg.sender]) revert POAP__AlreadyClaimed();
        hasClaimed[eventId][msg.sender] = true;
        
        _mint(msg.sender, eventId, 1, "");
        
        emit NewMint(eventId, msg.sender);
    }

    /**
     * @notice Mints a POAP using a Merkle proof for allowlist verification
     * @param eventId The ID of the event to mint
     * @param merkleProof Proof that caller is in the allowlist
     * @dev Allowlist must be enabled (allowlistRoot != 0)
     * @dev Emits NewMint on success
     */    
    function allowlistMint(
        uint256 eventId,
        bytes32[] calldata merkleProof
    ) external nonReentrant {
        if (eventId > totalEvents) revert POAP__InvalidValue("eventId");

        bytes32 allowlistRoot = events[eventId].allowlistRoot;
        if (allowlistRoot == bytes32(0)) revert POAP__AllowlistNotEnabled();

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        if (
            !MerkleProof.verify(merkleProof, allowlistRoot, leaf)
        ) revert POAP__InvalidValue("proof");

        if (hasClaimed[eventId][msg.sender]) revert POAP__AlreadyClaimed();
        hasClaimed[eventId][msg.sender] = true;
        
        _mint(msg.sender, eventId, 1, "");
        
        emit NewMint(eventId, msg.sender);
    }

    /**
     * @notice Mints a POAP using an ECDSA signature from the event creator
     * @param eventId The ID of the event to mint
     * @param signature Creator's signature of (eventId, chainId, recipient)
     * @dev Valid for 37 days after event creation (30 day timelock + 7 day grace)
     * @dev Emits NewMint on success
     */    
    function mintWithSignature(
        uint256 eventId, 
        bytes calldata signature
    ) external onlyBeforeLock(eventId, 7 days) nonReentrant {
        if (eventId > totalEvents) revert POAP__InvalidValue("eventId");
        
        bytes32 message = keccak256(abi.encodePacked(eventId, block.chainid, msg.sender));
        address signer = message.toEthSignedMessageHash().recover(signature);
        if (signer != events[eventId].creator) revert POAP__InvalidValue("signer");
        
        if (hasClaimed[eventId][msg.sender]) revert POAP__AlreadyClaimed();
        hasClaimed[eventId][msg.sender] = true;        

        _mint(msg.sender, eventId, 1, "");
        
        emit NewMint(eventId, msg.sender);
    }
    
    // ============ Creator Functions ============

    /**
     * @notice Batch mints POAPs to specified recipients (creator only)
     * @param eventId The ID of the event
     * @param recipients Array of addresses to receive POAPs
     * @dev Skips addresses that have already claimed without reverting
     * @dev Limited to 101 recipients per call
     * @dev Must be called within 30 days of event creation
     * @dev Emits NewMint for each successful mint
     */
    function creatorMint(
        uint256 eventId,
        address[] calldata recipients
    ) external onlyCreator(eventId) onlyBeforeLock(eventId, 0) nonReentrant {
        if (recipients.length > 101) revert POAP__InvalidValue("recipients");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            address recipient = recipients[i];
            
            if (hasClaimed[eventId][recipient]) continue; // Skip without reverting          
            hasClaimed[eventId][recipient] = true;
            
            _mint(recipient, eventId, 1, "");
            
            emit NewMint(eventId, recipient);
        }
    }

    /**
     * @notice Sets the Merkle root for allowlist verification (creator only, one-time)
     * @param eventId The ID of the event
     * @param newRoot The Merkle root of the allowlist
     * @dev Can only be called once per event
     * @dev Must be called within 30 days of event creation
     * @dev Emits AllowlistUpdated on success
     */
    function updateAllowlistRoot(
        uint256 eventId,
        bytes32 newRoot
    ) external onlyCreator(eventId) onlyBeforeLock(eventId, 0) {        
        if (events[eventId].allowlistRoot != bytes32(0)) revert POAP__RootAlreadySet();
        events[eventId].allowlistRoot = newRoot;
        emit AllowlistUpdated(eventId, newRoot);
    }

    /**
     * @notice Toggles public minting status (creator only)
     * @param eventId The ID of the event
     * @param isPublic Whether public minting should be enabled
     * @dev Must be called within 30 days of event creation
     * @dev Emits EventPublicUpdated on success
     */    
    function updateEventPublic(
        uint256 eventId,
        bool isPublic
    ) external onlyCreator(eventId) onlyBeforeLock(eventId, 0) {        
        events[eventId].isPublic = isPublic;
        emit EventPublicUpdated(eventId, isPublic);
    }

    // ============ Soulbound & Transfer Overrides ============

    /**
     * @notice Override of ERC1155 _update to enforce soulbound restriction
     * @param from Source address (0 for mints)
     * @param to Destination address (0 for burns)
     * @param ids Array of token IDs being transferred
     * @param values Array of amounts being transferred
     * @dev Blocks transfers for soulbound tokens (except mints and burns)
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        for (uint256 i = 0; i < ids.length; i++) {
            uint256 eventId = ids[i];
            Event storage evt = events[eventId];
            
            if (evt.isSoulbound && from != address(0) && to != address(0)) {
                revert POAP__SoulboundNotTransferable();
            }
        }        
        super._update(from, to, ids, values);
    }

    // ============ Metadata ============

    /**
     * @notice Returns the ERC1155 metadata URI for a given token
     * @param eventId The ID of the event/token
     * @return Base64-encoded JSON metadata with onchain SVG
     * @dev Constructs full metadata including attributes and image
     */
    function uri(uint256 eventId) public view override returns (string memory) {
        if (eventId > totalEvents) revert POAP__InvalidValue("eventId");
        
        Event storage evt = events[eventId];
        
        string memory svgBase64 = string(SSTORE2.read(evt.svgImage));
        
        string memory attributes = string(abi.encodePacked(
            '[',
                '{"trait_type":"Event","value":"', evt.name, '"},',
                '{"trait_type":"Location","value":"', evt.location, '"},',
                '{"trait_type":"Date","display_type":"date","value":"', evt.eventDate.toString(), '"},',
                '{"trait_type":"EventId","value":"', eventId.toString(), '"},',
                '{"trait_type":"Multichain EventId","value":"', getMultichainEventId(eventId), '"},',
                '{"trait_type":"Creator","value":"', evt.creator.toHexString(), '"},',
                '{"trait_type":"Soulbound","value":"', evt.isSoulbound ? "true" : "false", '"}',
            ']'
        ));

        string memory json = string(abi.encodePacked(
            '{',
                '"name":"', evt.name, '",',
                '"description":"', evt.description, '",',
                '"image":"data:image/svg+xml;base64,', svgBase64, '",',
                '"attributes":', attributes, ',',
                '"external_url":"',  evt.externalUrl, '"',
            '}'
        ));

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }

    // ============ View Functions ============

    /**
     * @notice Generates the CAIP-2 multichain event ID
     * @param eventId The local event ID
     * @return The multichain identifier in format eip155:{chainId}:{contract}:{eventId}
     * @dev Used for cross-chain identification of events
     */    
    function getMultichainEventId(uint256 eventId) public view returns (string memory) {
        return string(abi.encodePacked(
            "eip155:", 
            block.chainid.toString(), 
            ":", 
            address(this).toHexString(), 
            ":", 
            eventId.toString()
        ));
    }

    // ============ Interface Support ============

    
    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
