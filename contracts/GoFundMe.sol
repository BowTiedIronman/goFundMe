// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error GoFundMe__OnlyOwner();
error GoFundMe__NotEnoughETH();

contract GoFundMe {
    using PriceConverter for uint256;

    address private immutable i_owner;
    address[] private s_funders;
    mapping(address => uint) public s_addressToAmountFunded;
    uint256 public immutable i_min_usd;
    AggregatorV3Interface public immutable priceFeed;

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert GoFundMe__OnlyOwner();
        _;
    }

    constructor(
        uint256 _min_usd,
        AggregatorV3Interface priceFeedAddress,
        address owner
    ) {
        i_owner = owner;
        i_min_usd = _min_usd;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        if (msg.value.getConversionRate(priceFeed) < i_min_usd)
            revert GoFundMe__NotEnoughETH();
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

    function getFunders() public view onlyOwner returns (address[] memory) {
        return s_funders;
    }

    function getMinUsd() public view returns (uint256) {
        return i_min_usd;
    }

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }
}
