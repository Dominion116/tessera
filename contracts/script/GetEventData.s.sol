// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Poap.sol";

contract GetEventDataScript is Script {
    function run() external {        
        address poapAddress = vm.envAddress("POAP_BASE_SEPOLIA");

        uint256 eventId = 3;

        OnchainPOAPs poap = OnchainPOAPs(poapAddress);
        
        OnchainPOAPs.Event memory eventData = getEvent(poap, eventId);
        
        console.log("Onchain POAP #", eventId);
        console.log("Name:", eventData.name);
        console.log("Description:", eventData.description);
        console.log("Date:", eventData.eventDate);
        console.log("Location:", eventData.location);
        console.log("Creator:", eventData.creator);
        console.log("Is Soulbound?:", eventData.isSoulbound);        
        console.log("Is Public?:", eventData.isPublic);
        
        string memory uri = poap.uri(eventId);
        
        console.log("URI:", uri);
        
        string memory multichainEventId = poap.getMultichainEventId(eventId);
        
        console.log("Mutichain Event Id:", multichainEventId);
    }
    
    // Helper to get event data
    function getEvent(OnchainPOAPs poap, uint256 eventId) internal view returns (OnchainPOAPs.Event memory) {
        // Unpack the tuple returned by the public mapping
        (string memory name, string memory description, uint256 eventDate, 
         string memory location, bytes32 allowlistRoot, address svgImage,
         address creator, uint256 createdAt, string memory externalUrl,
         bool isSoulbound, bool isPublic) = poap.events(eventId);
        
        return OnchainPOAPs.Event({
            name: name,
            description: description,
            eventDate: eventDate,
            location: location,
            allowlistRoot: allowlistRoot,
            svgImage: svgImage,
            creator: creator,
            createdAt: createdAt,
            externalUrl: externalUrl,
            isSoulbound: isSoulbound,
            isPublic: isPublic
        });
    }    
    
    /* LOGS EXAMPLE
    
      == Logs ==
        Onchain POAP # 0
        Name: Onchain POAPs
        Description: The first Onchain POAP
        Date: 1786345914
        Location: Onchain
        Creator: 0x8C2b307fD0C037561eb2958873258eFc932ADa24
        Is Soulbound?: true
        Is Public?: true
        URI: data:application/json;base64,...
        Mutichain Event Id: eip155:84532:0xc3249356a483fbe17d5355d39105d2ea666d9de6:0

    */
}
