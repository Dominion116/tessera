// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Poap.sol";

contract MintCreatorDropScript is Script {
    function run() external {
        address creatorAddress = vm.envAddress("DEPLOYER_BASE_SEPOLIA");
        address recipientAddress = vm.envAddress("DEPLOYER_BASE");
        address poapAddress = vm.envAddress("POAP_BASE_SEPOLIA");
        
        address[] memory recipients = new address[](2);
        recipients[0] = creatorAddress;
        recipients[1] = recipientAddress;

        uint256 eventId = 0;

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        OnchainPOAPs poap = OnchainPOAPs(poapAddress);
        
        // will silently skip any recipient that have already claimed
        poap.creatorMint(eventId, recipients);
        
        console.log("Onchain POAP #", eventId);
        console.log("New Onchain POAP minted to:", creatorAddress);
        console.log("New Onchain POAP minted to:", recipientAddress);
        
        vm.stopBroadcast();
    }
}
