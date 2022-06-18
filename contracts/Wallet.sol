 //SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import 'hardhat/console.sol';

contract Wallet{
    function deposit()public payable {
        require(msg.value==5 ether,'send 5 ether');
    }

    function withdraw() public returns(uint256){
        // payable(msg.sender).transfer(5 ether);
        address payable _recipient=payable(msg.sender);
        (bool success,)=_recipient.call{ value: 2 ether }("");
        require(success);
        // console.log(_recipient.balance,success);
        return 5;
    }


    function withdrawPayload()public pure returns(bytes memory){
        return abi.encodeWithSignature("withdraw()");
    }
    

}