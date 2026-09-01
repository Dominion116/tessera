// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Poap.sol";

contract RegisterSignatureEventScript is Script {

    string public constant SVG_IMAGE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1e2682"/><stop offset="100%" style="stop-color:#ff26ff"/></linearGradient></defs><path fill="url(#a)" d="M0 0h512v512H0z"/><circle cx="256" cy="256" r="190" fill="none" stroke="#ffe5ff" stroke-width="4" opacity=".8"/><circle cx="256" cy="256" r="180" fill="none" stroke="#ffe5ff" stroke-width="2" opacity=".6"/><text x="256" y="210" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="gold">SIGNATURE</text><text x="256" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="38" font-weight="bold" fill="gold">ONCHAIN</text><text x="256" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="gold">POAP</text></svg>';
 
    function run() external {        
        address creatorAddress = vm.envAddress("DEPLOYER_BASE_SEPOLIA");
        address poapAddress = vm.envAddress("POAP_BASE_SEPOLIA");
        
        string memory name = "Onchain POAP Signature";
        string memory description = "Onchain POAP with signature";
        uint256 eventDate = block.timestamp;
        string memory location = "Onchain";
        string memory externalUrl = "";
        // flags: 0 = no public & no soulbound, 1 = soulbound, 2 = public, 3 = public & soulbound
        uint8 flags = 0; // no public & no soulbound      

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        OnchainPOAPs poap = OnchainPOAPs(poapAddress);
        
        // register the poap
        uint256 eventId = poap.registerEvent(
            name,
            description,
            eventDate,
            location,
            bytes32(0),
            SVG_IMAGE,
            externalUrl,
            flags
        );
        
        console.log("New Onchain POAP registered with eventId:", eventId);
        console.log("New Onchain POAP registered by:", creatorAddress);
        
        // optional: mint the poap to creator address
        /*
        bytes32 message = keccak256(abi.encodePacked(eventId, block.chainid, creatorAddress));
        bytes32 ethSignedMessage = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            message
        ));

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(vm.envUint("PRIVATE_KEY"), ethSignedMessage);
        bytes memory signature = abi.encodePacked(r, s, v);
        poap.mintWithSignature(eventId, signature);
        
        console.log("New Onchain POAP minted to:", creatorAddress);
        */
        
        vm.stopBroadcast();
    }
}
