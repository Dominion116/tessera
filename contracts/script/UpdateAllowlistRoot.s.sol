// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Poap.sol";

contract UpdateAllowslistRootScript is Script {
 
    function run() external {        
        address creatorAddress = vm.envAddress("DEPLOYER_BASE_SEPOLIA");
        address poapAddress = vm.envAddress("POAP_BASE_SEPOLIA");

        address user1 = creatorAddress;
        address user2 = vm.envAddress("DEPLOYER_BASE");
        
        bytes32 leaf1 = keccak256(abi.encodePacked(user1));
        bytes32 leaf2 = keccak256(abi.encodePacked(user2));        
        bytes32 left = leaf1 < leaf2 ? leaf1 : leaf2;
        bytes32 right = leaf1 < leaf2 ? leaf2 : leaf1;
        
        bytes32 allowlistRoot = keccak256(abi.encodePacked(left, right)); 
        
        uint256 eventId = 0;       

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
 
        OnchainPOAPs poap = OnchainPOAPs(poapAddress);
        
        poap.updateAllowlistRoot(eventId, allowlistRoot);
        
        console.log("Allowlist root updated for Onchain POAP #:", eventId);
        //console.log("New allowlist root:", allowlistRoot);
        
        // optional: mint the poap to creator address
        //bytes32[] memory proof = new bytes32[](1);
        //proof[0] = leaf2;
        //poap.allowlistMint(eventId, proof);
        
        //console.log("New Onchain POAP minted to:", creatorAddress);
        
        vm.stopBroadcast();
    }
}
