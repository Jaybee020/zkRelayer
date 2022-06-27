 //SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Registry{
    address public forwarderAddress;//address of fowarder contract

    constructor(address _forwarderAddress){
        forwarderAddress=_forwarderAddress;
    }
    event RelayLog(address indexed _relayer,uint256 fee);//after forwarder successfully relays contract
    event RelayerLocatorSet(address indexed _relayer);

    struct RelayerLocator {
        string locator;     //how users can communicate with broadacaster nodes(should be endpoiny)
    }

    struct RelayerAggFee{
        uint sum;
        uint count;
    }

    mapping(address => RelayerLocator) public relayertoLocator;
    mapping(address => RelayerAggFee) public  relayertoFee;


    //dynamic list for relayers
    struct Relayers {
        uint256 count;
        mapping(uint256 => address) list;
        mapping(address => bool) set;
    }

    Relayers public allRelayers;

    modifier forwarderOnly() {
        require(msg.sender == forwarderAddress, "Caller is not the forwarder");
        _;
    }

    //get amount of Relayers
    function getRelayersCount()public view returns(uint256){
        return allRelayers.count;
    }

    //get relayer by index
    function getRelayerByIdx(uint _index) public view returns(address){
        return allRelayers.list[_index];
    }

    

    //check if relayer exists 
    function relayerExists(address _relayer) public view returns(bool){
        return allRelayers.set[_relayer];
    }

    //add relayer to registry
    function addRelayer(address _relayer)internal {
        //only add if relayer is not part of registry
        if(!relayerExists(_relayer)){
            allRelayers.set[_relayer]=true;
            allRelayers.list[allRelayers.count]=_relayer;
            allRelayers.count++;
        }
    }

    //set locator ip for relayer
    function setRelayerLocator(address _relayer,string calldata ipAddr) public {
        require(msg.sender==_relayer,"can only set locator for self");
        addRelayer(_relayer);
        relayertoLocator[_relayer]=RelayerLocator(ipAddr);
        emit RelayerLocatorSet(_relayer);

    }

    function logRelay(address _relayer,uint256 fee)external forwarderOnly{
        addRelayer(_relayer);
        RelayerAggFee memory aggFee=relayertoFee[_relayer];
        relayertoFee[_relayer] = RelayerAggFee(
            aggFee.sum + fee,
            aggFee.count + 1
        );
        emit RelayLog(_relayer,fee);
    }


}