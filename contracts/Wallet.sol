// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract Wallet {

    address[] public approvers;
    uint public quorum;

    struct Transfer {
        //uint id;
        uint amount;
        address payable to;
        uint approvals;
        bool sent;
    }

    //mapping(uint => Transfer) public transfers;
    Transfer[] public transfers;
    mapping(address => mapping(uint => bool)) approvals;

    constructor(address[] memory _approvers, uint _quorum) public {
        approvers = _approvers;
        quorum = _quorum;
    }

    function getApprovers() external view returns(address[] memory) {
        return approvers;
    }

    function createTransfers(address payable _to, uint _amount) onlyApprover() external {
        transfers.push(Transfer(
            //nextId,
            _amount,
            _to,
            0,
            false
        ));

        //nextId++;
    }

    function getTransfers() external view returns(Transfer[] memory) {
        return transfers;
    }

    function approveTransfer(uint _index) external onlyApprover() {
        require(transfers[_index].sent == false, "transfer has already been sent");
        require(approvals[msg.sender][_index] == false, "cannot approve transfer twice");

        approvals[msg.sender][_index] = true;
        transfers[_index].approvals++;

        if (transfers[_index].approvals >= quorum) {
            transfers[_index].sent = true;
            address payable to = transfers[_index].to;
            uint amount = transfers[_index].amount;

            to.transfer(amount);
        }
    }

    modifier onlyApprover() {
        bool allowed = false;
        for (uint i = 0; i < approvers.length; i++) {
            if (approvers[i] == msg.sender) {
                allowed = true;
            }
        }

        require(allowed == true, "only approvers");
        _;
    }

    receive() external payable {
        // transfer to address on contract
    }
}