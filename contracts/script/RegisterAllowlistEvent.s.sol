// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Poap.sol";

contract RegisterAllowlistEventScript is Script {

    string public constant SVG_IMAGE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1e2682"/><stop offset="100%" style="stop-color:#ff26ff"/></linearGradient></defs><path fill="url(#a)" d="M0 0h512v512H0z"/><circle cx="256" cy="256" r="190" fill="none" stroke="#ffe5ff" stroke-width="4" opacity=".8"/><circle cx="256" cy="256" r="180" fill="none" stroke="#ffe5ff" stroke-width="2" opacity=".6"/><text x="256" y="210" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="gold">ALLOWLIST</text><text x="256" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="38" font-weight="bold" fill="gold">ONCHAIN</text><text x="256" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="gold">POAP</text></svg>';
 
    function run() external {        
        address creatorAddress = vm.envAddress("DEPLOYER_BASE_SEPOLIA");
        address poapAddress = vm.envAddress("POAP_BASE_SEPOLIA");
        
        string memory name = "Onchain POAP Allowlist";
        string memory description = "Onchain POAP with allowlist";
        uint256 eventDate = block.timestamp;
        string memory location = "Onchain";
        string memory externalUrl = "";
        // flags: 0 = no public & no soulbound, 1 = soulbound, 2 = public, 3 = public & soulbound
        uint8 flags = 0; // no public & no soulbound

        address user1 = creatorAddress;
        address user2 = vm.envAddress("DEPLOYER_BASE");
        
        bytes32 leaf1 = keccak256(abi.encodePacked(user1));
        bytes32 leaf2 = keccak256(abi.encodePacked(user2));        
        bytes32 left = leaf1 < leaf2 ? leaf1 : leaf2;
        bytes32 right = leaf1 < leaf2 ? leaf2 : leaf1;
        
        bytes32 allowlistRoot = keccak256(abi.encodePacked(left, right));        

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
 
        OnchainPOAPs poap = OnchainPOAPs(poapAddress);
        
        // register the poap
        uint256 eventId = poap.registerEvent(
            name,
            description,
            eventDate,
            location,
            allowlistRoot,
            SVG_IMAGE,
            externalUrl,
            flags
        );
        
        console.log("New Onchain POAP registered with eventId:", eventId);
        console.log("New Onchain POAP registered by:", creatorAddress);
        
        // optional: mint the poap to creator address
        //bytes32[] memory proof = new bytes32[](1);
        //proof[0] = leaf2;
        //poap.allowlistMint(eventId, proof);
        
        //console.log("New Onchain POAP minted to:", creatorAddress);
        
        vm.stopBroadcast();
    }
}
