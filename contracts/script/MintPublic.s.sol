// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Poap.sol";

contract MintPublicScript is Script {
    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        
        address minterAddress = vm.envAddress("DEPLOYER_BASE_SEPOLIA");
        address poapAddress = vm.envAddress("POAP_BASE_SEPOLIA");
        
        OnchainPOAPs poap = OnchainPOAPs(poapAddress);
        
        uint256 eventId = 1;
        poap.mint(eventId);
        
        console.log("Onchain POAP #", eventId);
        console.log("New Onchain POAP minted to:", minterAddress);
        
        vm.stopBroadcast();
    }
}
