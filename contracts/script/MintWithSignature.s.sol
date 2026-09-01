// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Poap.sol";

contract MintWithSignatureScript is Script {
    function run() external {         
        address minterAddress = vm.envAddress("DEPLOYER_BASE_SEPOLIA");
        address poapAddress = vm.envAddress("POAP_BASE_SEPOLIA");

        uint256 eventId = 3;        
        bytes32 message = keccak256(abi.encodePacked(eventId, block.chainid, minterAddress));
        bytes32 ethSignedMessage = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            message
        ));

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(vm.envUint("PRIVATE_KEY"), ethSignedMessage);
        bytes memory signature = abi.encodePacked(r, s, v);
 
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
 
        OnchainPOAPs poap = OnchainPOAPs(poapAddress);
        
        poap.mintWithSignature(eventId, signature);
        
        console.log("Onchain POAP #", eventId);
        console.log("New Onchain POAP minted to:", minterAddress);
        
        vm.stopBroadcast();
    }
}
