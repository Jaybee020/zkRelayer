 //SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Registry.sol";
import 'hardhat/console.sol';

contract Forwarder is Ownable{
    Registry public reputation;

    //set registry contract
    function setReputation(address _reputationAddress) external onlyOwner {
        require(address(reputation) == address(0), "Can only set registry contract once");
        reputation = Registry(_reputationAddress);
    }


    function _forwardcall(address _applicationContract,bytes memory _encodedPayload)internal returns (uint256 fee){
        //fee is the calculated by the increase of the balance of the contract after receiving it from application contract
        uint256 initialBalance=address(this).balance;
        (bool success,) = _applicationContract.call(_encodedPayload);
        require(success, "function foward call complete");
        uint256 finalBalance = address(this).balance;
        // console.log(initialBalance,finalBalance);
        if (finalBalance > initialBalance) {
            fee = finalBalance-initialBalance;//
        } else {
            fee = 0;
        }

        return fee;
    }


    //forward application contract call
    function forwardCall(
        address _applicationContract,
        bytes calldata _encodedPayload
    ) external{
        require(address(reputation) != address(0), "Registry contract is needed to forward ");//making sure registry contract is set
        require(tx.origin == msg.sender, "can't relay calls from contracts");//making sure it is a valid call 
        uint256 fee = _forwardcall(_applicationContract, _encodedPayload);//get fee contract got by processing contracts
        address payable relayer = payable(msg.sender);
        if (fee > 0) {
            relayer.transfer(fee);//transfer fee from contract to sender of tx
        }
        reputation.logRelay(relayer, fee);//log reputation to registry
    }


    receive() external payable{}

    fallback() external payable{}

    //add multiple forward calls
}
