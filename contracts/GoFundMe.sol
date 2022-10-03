// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GoFundMe {
    address public immutable i_owner;
    address[] private s_funders;
    mapping(address => uint) public s_addressToAmountFunded;

    modifier onlyOwner() {
        require(msg.sender == i_owner);
        _;
    }

    constructor() {
        i_owner = msg.sender;
    }

    function fund() public payable {
        s_addressToAmountFunded[msg.sender] = msg.value;
        s_funders.push(msg.sender);
    }

    function withdraw() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
        for (
            uint256 funder_idx = 0;
            funder_idx < s_funders.length;
            funder_idx++
        ) {
            s_addressToAmountFunded[s_funders[funder_idx]] = 0;
        }
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
}
