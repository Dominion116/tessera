// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Poap.sol";

contract UpdatePublicMintStatusScript is Script {
 
    function run() external {        
        address poapAddress = vm.envAddress("POAP_BASE_SEPOLIA");
        
        uint256 eventId = 1;
        bool isPublicOpen = true;

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
 
        OnchainPOAPs poap = OnchainPOAPs(poapAddress);
        
        poap.updateEventPublic(eventId, isPublicOpen);
        
        console.log("Updated public mint status for Onchain POAP #:", eventId);
        
        vm.stopBroadcast();
    }
}
