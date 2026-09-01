// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Poap.sol";

contract OnchainPOAPsTest is Test {
    OnchainPOAPs public poap;
    
    address public protocolAdmin;
    address public creator;
    uint256 public creatorKey;
    address public user1;
    address public user2;
    address public user3;   
    
    string public constant SVG_IMAGE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1e3c72"/><stop offset="100%" style="stop-color:#2a5298"/></linearGradient></defs><rect width="512" height="512" fill="url(#bg)"/><circle cx="256" cy="256" r="190" fill="none" stroke="#00e5ff" stroke-width="4" opacity="0.8"/><circle cx="256" cy="256" r="180" fill="none" stroke="#00bfff" stroke-width="2" opacity="0.6"/><text x="256" y="210" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="#ffd700">FIRST</text><text x="256" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="38" font-weight="bold" fill="#ffd700">ONCHAIN</text><text x="256" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="#ffd700">POAP</text></svg>';

    function setUp() public {
        protocolAdmin = makeAddr("protocolAdmin");
        creatorKey = 420;
        creator = vm.addr(creatorKey);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        
        vm.startPrank(protocolAdmin);
        poap = new OnchainPOAPs(SVG_IMAGE);
        vm.stopPrank();
    }

    // Helper to get event data
    function getEvent(uint256 eventId) internal view returns (OnchainPOAPs.Event memory) {
        // Unpack the tuple returned by the public mapping
        (string memory name, string memory description, uint256 eventDate, 
         string memory location, bytes32 allowlistRoot, address svgImage,
         address creatorr, uint256 createdAt, string memory externalUrl,
         bool isSoulbound, bool isPublic) = poap.events(eventId);
        
        return OnchainPOAPs.Event({
            name: name,
            description: description,
            eventDate: eventDate,
            location: location,
            allowlistRoot: allowlistRoot,
            svgImage: svgImage,
            creator: creatorr,
            createdAt: createdAt,
            externalUrl: externalUrl,
            isSoulbound: isSoulbound,
            isPublic: isPublic
        });
    }
    
    // ============ Event Registration Tests ============
    
    function test_RegisterEvent() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "ETH Global",
            "ETH Global Hackathon 2024",
            block.timestamp + 30 days,
            "San Francisco",
            bytes32(0),
            SVG_IMAGE,
            "https://ethglobal.com",
            0
        );
        vm.stopPrank();
        
        assertEq(eventId, 1);
        assertEq(poap.totalEvents(), 1);
        
        OnchainPOAPs.Event memory evt = getEvent(eventId);
        assertEq(evt.name, "ETH Global");
        assertEq(evt.creator, creator);
        assertFalse(evt.isSoulbound);
        assertEq(evt.eventDate, block.timestamp + 30 days);
        assertEq(poap.totalSupply(eventId), 0);
    }
    
    function test_RegisterEvent_Flags() public {
        vm.startPrank(creator);
        uint256 eventId0 = poap.registerEvent(
            "Special Event 0",
            "One time attendance",
            block.timestamp,
            "NYC",
            bytes32(0),
            SVG_IMAGE,
            "https://example.com",
            0
        );
        uint256 eventId1 = poap.registerEvent(
            "Special Event 1",
            "One time attendance",
            block.timestamp,
            "MAD",
            bytes32(0),
            SVG_IMAGE,
            "https://example.com",
            1
        );
        uint256 eventId2 = poap.registerEvent(
            "Special Event 2",
            "One time attendance",
            block.timestamp,
            "MEX",
            bytes32(0),
            SVG_IMAGE,
            "https://example.com",
            2
        );
        uint256 eventId3 = poap.registerEvent(
            "Special Event 3",
            "One time attendance",
            block.timestamp,
            "MUN",
            bytes32(0),
            SVG_IMAGE,
            "https://example.com",
            3
        );
        vm.stopPrank();
        
        OnchainPOAPs.Event memory evt0 = getEvent(eventId0);
        assertFalse(evt0.isSoulbound);
        assertFalse(evt0.isPublic);

        OnchainPOAPs.Event memory evt1 = getEvent(eventId1);
        assertTrue(evt1.isSoulbound);
        assertFalse(evt1.isPublic);

        OnchainPOAPs.Event memory evt2 = getEvent(eventId2);
        assertFalse(evt2.isSoulbound);
        assertTrue(evt2.isPublic);

        OnchainPOAPs.Event memory evt3 = getEvent(eventId3);
        assertTrue(evt3.isSoulbound);
        assertTrue(evt3.isPublic);
    }
    
    function test_Revert_RegisterEvent_NoName() public {
        vm.startPrank(creator);
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "name"));
        poap.registerEvent(
            "",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
    }
    
    function test_Revert_RegisterEvent_NoSVG() public {
        vm.startPrank(creator);
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "svg"));
        poap.registerEvent(
            "Name",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            "",
            "",
            0
        );
        vm.stopPrank();
    }
    
    function test_MultipleEvents() public {
        vm.startPrank(creator);
        
        uint256 event1 = poap.registerEvent("Event 1", "Desc", block.timestamp, "Loc", bytes32(0), SVG_IMAGE, "", 0);
        uint256 event2 = poap.registerEvent("Event 2", "Desc", block.timestamp, "Loc", bytes32(0), SVG_IMAGE, "", 0);
        uint256 event3 = poap.registerEvent("Event 3", "Desc", block.timestamp, "Loc", bytes32(0), SVG_IMAGE, "", 0);
        
        vm.stopPrank();
        
        assertEq(event1, 1);
        assertEq(event2, 2);
        assertEq(event3, 3);
        assertEq(poap.totalEvents(), 3);
    }
    
function test_Revert_RegisterEvent_NameTooLong() public {
        vm.startPrank(creator);
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "name"));
        poap.registerEvent(
            string(new bytes(129)),
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
    }
    
    function test_Revert_RegisterEvent_DescriptionTooLong() public {
        vm.startPrank(creator);
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "description"));
        poap.registerEvent(
            "Valid Name",
            string(new bytes(513)),
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
    }
    
    function test_Revert_RegisterEvent_LocationTooLong() public {
        vm.startPrank(creator);
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "location"));
        poap.registerEvent(
            "Valid Name",
            "Description",
            block.timestamp,
            string(new bytes(129)),
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
    }
    
    function test_Revert_RegisterEvent_ExternalUrlTooLong() public {
        vm.startPrank(creator);
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "url"));
        poap.registerEvent(
            "Valid Name",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            string(new bytes(129)),
            0
        );
        vm.stopPrank();
    }
/*    
    function test_Revert_RegisterEvent_SVGTooLarge() public {
        vm.startPrank(creator);
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "svg"));
        poap.registerEvent(
            "Valid Name",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            string(new bytes(20001)),
            "",
            0
        );
        vm.stopPrank();
    }
*/    
    function test_RegisterEvent_MaxLengthValues() public {
        vm.startPrank(creator);
        // Should succeed with exactly max length values
        uint256 eventId = poap.registerEvent(
            string(new bytes(128)),      // max name
            string(new bytes(512)),      // max description
            block.timestamp,
            string(new bytes(128)),      // max location
            bytes32(0),
            string(new bytes(20000)),    // max svg
            string(new bytes(128)),      // max url
            0
        );
        vm.stopPrank();
        
        assertEq(eventId, 1);
        OnchainPOAPs.Event memory evt = getEvent(eventId);
        assertEq(bytes(evt.name).length, 128);
        assertEq(bytes(evt.description).length, 512);
        assertEq(bytes(evt.location).length, 128);
        assertEq(bytes(evt.externalUrl).length, 128);
    }
    
    function test_RegisterEvent_EmptyDescriptionAllowed() public {
        vm.startPrank(creator);
        // Description can be empty (0 length)
        uint256 eventId = poap.registerEvent(
            "Valid Name",
            "",                          // empty description
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",                          // empty url also allowed
            0
        );
        vm.stopPrank();
        
        assertEq(eventId, 1);
        OnchainPOAPs.Event memory evt = getEvent(eventId);
        assertEq(evt.description, "");
        assertEq(evt.externalUrl, "");
    }
    
    // ============ Public Mint Tests ============
    
    function test_PublicMint_Open() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Open Event",
            "Anyone can join",
            block.timestamp,
            "Online",
            bytes32(0),
            SVG_IMAGE,
            "",
            2
        );
        poap.updateEventPublic(eventId, true);
        vm.stopPrank();
        
        vm.startPrank(user1);
        poap.mint(eventId);
        vm.stopPrank();
        
        assertEq(poap.balanceOf(user1, eventId), 1);
        assertTrue(poap.hasClaimed(eventId, user1));
        
        assertEq(poap.totalSupply(eventId), 1);
    }
    
    function test_Revert_Mint_AlreadyClaimed() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "One Time Event",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            2
        );
        poap.updateEventPublic(eventId, true);
        vm.stopPrank();
        
        vm.startPrank(user1);
        
        poap.mint(eventId);
        
        vm.expectRevert(OnchainPOAPs.POAP__AlreadyClaimed.selector);
        poap.mint(eventId);
        
        vm.stopPrank();
    }
    
    // ============ Allowlist Mint Tests ============ 

    function test_Mint_WithAllowlist() public {
        bytes32 leaf1 = keccak256(abi.encodePacked(user1));
        bytes32 leaf2 = keccak256(abi.encodePacked(user2));
        
        bytes32 left = leaf1 < leaf2 ? leaf1 : leaf2;
        bytes32 right = leaf1 < leaf2 ? leaf2 : leaf1;
        
        bytes32 root = keccak256(abi.encodePacked(left, right));
        
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Allowlist Event",
            "Private event",
            block.timestamp,
            "Secret Location",
            root,
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
        
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = leaf2;
        
        vm.startPrank(user1);
        poap.allowlistMint(eventId, proof);
        vm.stopPrank();
        
        assertEq(poap.balanceOf(user1, eventId), 1);
    }
    
    function test_Revert_Mint_NotInAllowlist() public {
        bytes32 root = keccak256(abi.encodePacked("random"));
        
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Private Event",
            "Description",
            block.timestamp,
            "Location",
            root,
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
        
        vm.startPrank(user1);
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "proof"));
        poap.allowlistMint(eventId, new bytes32[](0));
        vm.stopPrank();
    }    

    
    function test_Revert_AllowlistMint_NotEnabled() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "One Time Event",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
        
        vm.startPrank(user1);
        
        vm.expectRevert(OnchainPOAPs.POAP__AllowlistNotEnabled.selector);
        poap.allowlistMint(eventId, new bytes32[](0));
        
        vm.stopPrank();
    }
    
    // ============ Signature Mint Tests ============

    function test_MintWithSignature() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Signature Event",
            "Live event with QR codes",
            block.timestamp,
            "Conference Hall",
            bytes32(0),
            SVG_IMAGE,
            "https://event.com",
            0
        );
        vm.stopPrank();

        uint256 chainId = block.chainid;
        bytes32 message = keccak256(abi.encodePacked(eventId, chainId, user1));
        bytes32 ethSignedMessage = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            message
        ));

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(creatorKey, ethSignedMessage);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.startPrank(user1);
        poap.mintWithSignature(eventId, signature);
        vm.stopPrank();

        assertEq(poap.balanceOf(user1, eventId), 1);
        assertTrue(poap.hasClaimed(eventId, user1));
        assertEq(poap.totalSupply(eventId), 1);
    }

    function test_Revert_MintWithSignature_InvalidSigner() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Signature Event",
            "Live event",
            block.timestamp,
            "Hall",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();

        uint256 chainId = block.chainid;
        bytes32 message = keccak256(abi.encodePacked(eventId, chainId, user1));
        bytes32 ethSignedMessage = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            message
        ));

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(uint256(uint160(user2)), ethSignedMessage);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.startPrank(user1);
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "signer"));
        poap.mintWithSignature(eventId, signature);
        vm.stopPrank();
    }

    function test_Revert_MintWithSignature_WrongAddress() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Signature Event",
            "Live event",
            block.timestamp,
            "Hall",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();

        uint256 chainId = block.chainid;
        bytes32 message = keccak256(abi.encodePacked(eventId, chainId, user1));
        bytes32 ethSignedMessage = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            message
        ));

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(creatorKey, ethSignedMessage);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.startPrank(user2);
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "signer"));
        poap.mintWithSignature(eventId, signature);
        vm.stopPrank();
    }

    function test_Revert_MintWithSignature_AlreadyClaimed() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Signature Event",
            "Live event",
            block.timestamp,
            "Hall",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();

        uint256 chainId = block.chainid;
        bytes32 message = keccak256(abi.encodePacked(eventId, chainId, user1));
        bytes32 ethSignedMessage = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            message
        ));

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(creatorKey, ethSignedMessage);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.startPrank(user1);
        poap.mintWithSignature(eventId, signature);

        vm.expectRevert(OnchainPOAPs.POAP__AlreadyClaimed.selector);
        poap.mintWithSignature(eventId, signature);
        vm.stopPrank();
    }

    function test_Revert_MintWithSignature_InvalidEvent() public {
        uint256 chainId = block.chainid;
        bytes32 message = keccak256(abi.encodePacked(uint256(999), chainId, user1));
        bytes32 ethSignedMessage = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            message
        ));

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(creatorKey, ethSignedMessage);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.startPrank(user1);
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "eventId"));
        poap.mintWithSignature(999, signature);
        vm.stopPrank();
    }

    function test_MintWithSignature_MultipleUsers() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Signature Event",
            "Live event",
            block.timestamp,
            "Hall",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();

        address[] memory users = new address[](3);
        users[0] = user1;
        users[1] = user2;
        users[2] = user3;

        uint256 chainId = block.chainid;

        for (uint i = 0; i < users.length; i++) {
            bytes32 message = keccak256(abi.encodePacked(eventId, chainId, users[i]));
            bytes32 ethSignedMessage = keccak256(abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                message
            ));

            (uint8 v, bytes32 r, bytes32 s) = vm.sign(creatorKey, ethSignedMessage);
            bytes memory signature = abi.encodePacked(r, s, v);

            vm.startPrank(users[i]);
            poap.mintWithSignature(eventId, signature);
            vm.stopPrank();

            assertEq(poap.balanceOf(users[i], eventId), 1);
        }

        assertEq(poap.totalSupply(eventId), 3);
    }

    // Helper function to generate signatures for testing (add to test contract)
    function generateSignature(uint256 eventId, address user, uint256 signerKey) 
        internal 
        view 
        returns (bytes memory) 
    {
        uint256 chainId = block.chainid;
        bytes32 message = keccak256(abi.encodePacked(eventId, chainId, user));
        bytes32 ethSignedMessage = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            message
        ));

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerKey, ethSignedMessage);
        return abi.encodePacked(r, s, v);
    }

    // ============ Creator Mint Tests ============
    
    function test_CreatorMint() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Creator Mint Event",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = user2;
        recipients[2] = user3;
        
        poap.creatorMint(eventId, recipients);
        vm.stopPrank();
        
        assertEq(poap.balanceOf(user1, eventId), 1);
        assertEq(poap.balanceOf(user2, eventId), 1);
        assertEq(poap.balanceOf(user3, eventId), 1);
        
        assertEq(poap.totalSupply(eventId), 3);
    }
    
    function test_CreatorMint_SkipsAlreadyClaimed() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Creator Mint Event",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        poap.updateEventPublic(eventId, true);
        vm.stopPrank();
        
        vm.startPrank(user1);
        poap.mint(eventId);
        vm.stopPrank();
        
        address[] memory recipients = new address[](2);
        recipients[0] = user1;
        recipients[1] = user2;
        
        vm.startPrank(creator);
        poap.creatorMint(eventId, recipients);
        vm.stopPrank();
        
        assertEq(poap.balanceOf(user1, eventId), 1);
        assertEq(poap.balanceOf(user2, eventId), 1);
        
        assertEq(poap.totalSupply(eventId), 2);
    }
    
    function test_Revert_CreatorMint_AfterTimeLock() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Time Locked Event",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
        
        vm.warp(block.timestamp + 31 days);
        
        address[] memory recipients = new address[](1);
        recipients[0] = user1;
        
        vm.startPrank(creator);
        vm.expectRevert(OnchainPOAPs.POAP__TimeLockExpired.selector);
        poap.creatorMint(eventId, recipients);
        vm.stopPrank();
    }
    
    function test_Revert_CreatorMint_NotCreator() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Creator Only",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
        
        address[] memory recipients = new address[](1);
        recipients[0] = user1;
        
        vm.startPrank(user1);
        vm.expectRevert(OnchainPOAPs.POAP__OnlyCreator.selector);
        poap.creatorMint(eventId, recipients);
        vm.stopPrank();
    }
    
    // ============ Allowlist Update Tests ============
    
    function test_UpdateAllowlistRoot() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Updateable Event",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        
        bytes32 newRoot = keccak256(abi.encodePacked("new root"));
        
        poap.updateAllowlistRoot(eventId, newRoot);
        vm.stopPrank();
        
        OnchainPOAPs.Event memory evt = getEvent(eventId);
        assertEq(evt.allowlistRoot, newRoot);
    }
    
    function test_Revert_UpdateAllowlist_AfterTimeLock() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Locked Event",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
        
        vm.warp(block.timestamp + 31 days);
        
        vm.startPrank(creator);
        vm.expectRevert(OnchainPOAPs.POAP__TimeLockExpired.selector);
        poap.updateAllowlistRoot(eventId, bytes32(0));
        vm.stopPrank();
    }
    
    function test_Revert_UpdateAllowlist_NotCreator() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Creator Only",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
        
        vm.startPrank(user1);
        vm.expectRevert(OnchainPOAPs.POAP__OnlyCreator.selector);
        poap.updateAllowlistRoot(eventId, bytes32(0));
        vm.stopPrank();
    }
    
   
    // ============ Soulbound Tests ============
    
    function test_Soulbound_TransferBlocked() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Soulbound Token",
            "Non-transferable",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            1
        );
        poap.updateEventPublic(eventId, true);
        vm.stopPrank();
        
        vm.startPrank(user1);
        poap.mint(eventId);
        
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__SoulboundNotTransferable.selector));
        poap.safeTransferFrom(user1, user2, eventId, 1, "");
        vm.stopPrank();
    }
    
    function test_Soulbound_BatchTransferBlocked() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Soulbound Token",
            "Non-transferable",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            1
        );
        poap.updateEventPublic(eventId, true);
        vm.stopPrank();
        
        vm.startPrank(user1);
        poap.mint(eventId);
        
        uint256[] memory ids = new uint256[](1);
        ids[0] = eventId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1;
        
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__SoulboundNotTransferable.selector));
        poap.safeBatchTransferFrom(user1, user2, ids, amounts, "");
        vm.stopPrank();
    }
    
    function test_NonSoulbound_TransferAllowed() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Tradeable Token",
            "Transferable",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        poap.updateEventPublic(eventId, true);
        vm.stopPrank();
        
        vm.startPrank(user1);
        poap.mint(eventId);
        poap.safeTransferFrom(user1, user2, eventId, 1, "");
        vm.stopPrank();
        
        assertEq(poap.balanceOf(user1, eventId), 0);
        assertEq(poap.balanceOf(user2, eventId), 1);
    }
    
    // ============ Metadata Tests ============
    
    function test_Uri() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Metadata Test",
            "Testing metadata",
            1700000000,
            "Test Location",
            bytes32(0),
            SVG_IMAGE,
            "https://example.com/event",
            0
        );
        vm.stopPrank();
        
        string memory tokenUri = poap.uri(eventId);
        
        console.log(tokenUri);
        
        assertTrue(bytes(tokenUri).length > 0);
    }
    
    function test_Uri_InvalidEvent() public {
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "eventId"));
        poap.uri(999);
    }
    
    // ============ View Function Tests ============
    
    function test_HasUserClaimed() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Claim Test",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        poap.updateEventPublic(eventId, true);
        vm.stopPrank();
        
        assertFalse(poap.hasClaimed(eventId, user1));
        
        vm.startPrank(user1);
        poap.mint(eventId);
        vm.stopPrank();
        
        assertTrue(poap.hasClaimed(eventId, user1));
    }
    
    // ============ Time Lock View Tests ============
    
    function test_TimeLock_30Days() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Time Lock Test",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
        
        vm.warp(block.timestamp + 29 days);
        
        address[] memory recipients = new address[](1);
        recipients[0] = user1;
        
        vm.startPrank(creator);
        poap.creatorMint(eventId, recipients);
        vm.stopPrank();
        
        vm.warp(block.timestamp + 2 days);
        
        vm.startPrank(creator);
        vm.expectRevert(OnchainPOAPs.POAP__TimeLockExpired.selector);
        poap.creatorMint(eventId, recipients);
        vm.stopPrank();
    }
    
    // ============ Support Interface Tests ============
    
    function test_SupportsInterface() public view {
        assertTrue(poap.supportsInterface(type(IERC1155).interfaceId));
    }
    
// ============ Cross-Method Double Mint Prevention Tests ============
    
    function test_Revert_AlreadyClaimed_PublicThenAllowlist() public {
        bytes32 leaf1 = keccak256(abi.encodePacked(user1));
        bytes32 leaf2 = keccak256(abi.encodePacked(user2));
        bytes32 left = leaf1 < leaf2 ? leaf1 : leaf2;
        bytes32 right = leaf1 < leaf2 ? leaf2 : leaf1;
        bytes32 root = keccak256(abi.encodePacked(left, right));
        
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Cross Method Test",
            "Description",
            block.timestamp,
            "Location",
            root,
            SVG_IMAGE,
            "",
            2
        );
        poap.updateEventPublic(eventId, true);
        
        vm.stopPrank();
        
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = leaf2;
        
        vm.startPrank(user1);
        poap.allowlistMint(eventId, proof);
        
        vm.expectRevert(OnchainPOAPs.POAP__AlreadyClaimed.selector);
        poap.mint(eventId);
        vm.stopPrank();
    }
    
    function test_Revert_AlreadyClaimed_CreatorMintThenPublic() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Creator Then Public",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            2
        );
        poap.updateEventPublic(eventId, true);
        
        address[] memory recipients = new address[](1);
        recipients[0] = user1;
        poap.creatorMint(eventId, recipients);
        vm.stopPrank();
        
        vm.startPrank(user1);
        vm.expectRevert(OnchainPOAPs.POAP__AlreadyClaimed.selector);
        poap.mint(eventId);
        vm.stopPrank();
    }
    
    function test_Revert_AlreadyClaimed_PublicThenSignature() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Public Then Signature",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            2
        );
        poap.updateEventPublic(eventId, true);
        vm.stopPrank();
        
        vm.startPrank(user1);
        poap.mint(eventId);
        vm.stopPrank();
        
        uint256 chainId = block.chainid;
        bytes32 message = keccak256(abi.encodePacked(eventId, chainId, user1));
        bytes32 ethSignedMessage = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            message
        ));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(creatorKey, ethSignedMessage);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.startPrank(user1);
        vm.expectRevert(OnchainPOAPs.POAP__AlreadyClaimed.selector);
        poap.mintWithSignature(eventId, signature);
        vm.stopPrank();
    }
    
    function test_Revert_AlreadyClaimed_SignatureThenAllowlist() public {
        bytes32 leaf1 = keccak256(abi.encodePacked(user1));
        bytes32 leaf2 = keccak256(abi.encodePacked(user2));
        bytes32 left = leaf1 < leaf2 ? leaf1 : leaf2;
        bytes32 right = leaf1 < leaf2 ? leaf2 : leaf1;
        bytes32 root = keccak256(abi.encodePacked(left, right));
        
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Signature Then Allowlist",
            "Description",
            block.timestamp,
            "Location",
            root,
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
        
        uint256 chainId = block.chainid;
        bytes32 message = keccak256(abi.encodePacked(eventId, chainId, user1));
        bytes32 ethSignedMessage = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            message
        ));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(creatorKey, ethSignedMessage);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.startPrank(user1);
        poap.mintWithSignature(eventId, signature);
        
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = leaf2;
        vm.expectRevert(OnchainPOAPs.POAP__AlreadyClaimed.selector);
        poap.allowlistMint(eventId, proof);
        vm.stopPrank();
    }
    
    // ============ Creator Mint Batch Edge Cases ============
    
    function test_CreatorMint_ExceedsBatchLimit() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Large Batch",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        
        address[] memory recipients = new address[](102);
        for (uint i = 0; i < 102; i++) {
            recipients[i] = makeAddr(string.concat("recipient", vm.toString(i)));
        }
        
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "recipients"));
        poap.creatorMint(eventId, recipients);
        vm.stopPrank();
    }
    
    function test_CreatorMint_AllAlreadyClaimed() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "All Claimed",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            2
        );
        poap.updateEventPublic(eventId, true);
        vm.stopPrank();
        
        vm.startPrank(user1);
        poap.mint(eventId);
        vm.stopPrank();
        
        address[] memory recipients = new address[](1);
        recipients[0] = user1;
        
        vm.startPrank(creator);
        poap.creatorMint(eventId, recipients);
        vm.stopPrank();
        
        assertEq(poap.balanceOf(user1, eventId), 1);
        assertEq(poap.totalSupply(eventId), 1);
    }
    
    // ============ Allowlist Root Update Restrictions ============
    
    function test_Revert_UpdateAllowlist_AlreadySet() public {
        bytes32 root = keccak256(abi.encodePacked("root"));
        
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Allowlist Set Once",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        
        poap.updateAllowlistRoot(eventId, root);
        
        bytes32 newRoot = keccak256(abi.encodePacked("new root"));
        vm.expectRevert(OnchainPOAPs.POAP__RootAlreadySet.selector);
        poap.updateAllowlistRoot(eventId, newRoot);
        vm.stopPrank();
    }
    
    // ============ Signature Replay Protection Tests ============
    
    function test_Revert_SignatureReplay_DifferentEvent() public {
        vm.startPrank(creator);
        uint256 eventId1 = poap.registerEvent(
            "Event One",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        
        uint256 eventId2 = poap.registerEvent(
            "Event Two",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
        
        uint256 chainId = block.chainid;
        bytes32 message = keccak256(abi.encodePacked(eventId1, chainId, user1));
        bytes32 ethSignedMessage = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            message
        ));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(creatorKey, ethSignedMessage);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.startPrank(user1);
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "signer"));
        poap.mintWithSignature(eventId2, signature);
        vm.stopPrank();
    }
    
    function test_Revert_SignatureReplay_DifferentChain() public {
        vm.startPrank(creator);
        uint256 eventId = poap.registerEvent(
            "Chain Specific",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            SVG_IMAGE,
            "",
            0
        );
        vm.stopPrank();
        
        uint256 wrongChainId = 999999;
        bytes32 message = keccak256(abi.encodePacked(eventId, wrongChainId, user1));
        bytes32 ethSignedMessage = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            message
        ));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(creatorKey, ethSignedMessage);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.startPrank(user1);
        vm.expectRevert(abi.encodeWithSelector(OnchainPOAPs.POAP__InvalidValue.selector, "signer"));
        poap.mintWithSignature(eventId, signature);
        vm.stopPrank();
    }
}

// ============ Fuzz Tests ============

contract OnchainPOAPsFuzzTest is Test {
    OnchainPOAPs public poap;
    address public protocolAdmin;
    address public fuzzCreator;

    string public constant SVG_IMAGE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="blue"/></svg>';
    
    function setUp() public {
        protocolAdmin = makeAddr("admin");
        fuzzCreator = makeAddr("fuzzCreator");
        
        vm.startPrank(protocolAdmin);
        poap = new OnchainPOAPs(SVG_IMAGE);
        vm.stopPrank();
    }
    
    function testFuzz_RegisterEvent(
        string memory name,
        string memory description,
        uint256 eventDate,
        string memory location,
        string memory svgImage,
        string memory externalUrl,
        uint8 flags
    ) public {
        vm.assume(bytes(name).length > 0 && bytes(name).length <= 128);
        vm.assume(bytes(description).length <= 512);
        vm.assume(bytes(location).length <= 128);        // Add this
        vm.assume(bytes(svgImage).length > 0);
        vm.assume(bytes(externalUrl).length <= 128);       // Add this
        vm.assume(flags < 4);
        
        vm.startPrank(fuzzCreator);
        uint256 eventId = poap.registerEvent(
            name,
            description,
            eventDate,
            location,
            bytes32(0),
            svgImage,
            externalUrl,
            flags
        );
        vm.stopPrank();
        
        assertEq(poap.totalEvents(), eventId);
    }
    
    function testFuzz_MintMultipleUsers(uint8 userCount) public {
        vm.assume(userCount > 0 && userCount < 100);
        
        vm.startPrank(fuzzCreator);
        uint256 eventId = poap.registerEvent(
            "Fuzz Event",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            "<svg></svg>",
            "",
            2
        );
        poap.updateEventPublic(eventId, true);
        vm.stopPrank();
        
        for (uint256 i = 0; i < userCount; i++) {
            address user = makeAddr(string.concat("user", vm.toString(i)));
            vm.startPrank(user);
            poap.mint(eventId);
            vm.stopPrank();
            assertEq(poap.balanceOf(user, eventId), 1);
        }
        
        assertEq(poap.totalSupply(eventId), userCount);
    }
    
    function testFuzz_CreatorMintBatch(uint8 recipientCount) public {
        vm.assume(recipientCount > 0 && recipientCount < 50);
        
        vm.startPrank(fuzzCreator);
        uint256 eventId = poap.registerEvent(
            "Batch Event",
            "Description",
            block.timestamp,
            "Location",
            bytes32(0),
            "<svg></svg>",
            "",
            0
        );
        
        address[] memory recipients = new address[](recipientCount);
        for (uint256 i = 0; i < recipientCount; i++) {
            recipients[i] = makeAddr(string.concat("recipient", vm.toString(i)));
        }
        
        poap.creatorMint(eventId, recipients);
        vm.stopPrank();
        
        assertEq(poap.totalSupply(eventId), recipientCount);
    }  

}
