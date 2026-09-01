// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Poap.sol";

contract MintWithAllowlistScript is Script {
    function run() external {
        address poapAddress = vm.envAddress("POAP_BASE_SEPOLIA");       

        address user1 = vm.envAddress("DEPLOYER_BASE_SEPOLIA");
        address user2 = vm.envAddress("DEPLOYER_BASE");

        bytes32 leaf1 = keccak256(abi.encodePacked(user1));
        bytes32 leaf2 = keccak256(abi.encodePacked(user2));

        bytes32[] memory proof = new bytes32[](1);
        proof[0] = leaf2;

        uint256 eventId = 2;

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        
        OnchainPOAPs poap = OnchainPOAPs(poapAddress);
        
        poap.allowlistMint(eventId, proof);
        
        console.log("Onchain POAP #", eventId);
        console.log("New Onchain POAP minted to:", user1);
        
        vm.stopBroadcast();
    }
}
