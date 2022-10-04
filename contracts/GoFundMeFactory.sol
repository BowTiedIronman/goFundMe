// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./GoFundMe.sol";

contract GoFundMeFactory {
    GoFundMe[] public goFundMeArray;

    AggregatorV3Interface public immutable priceFeed;

    constructor(AggregatorV3Interface priceFeedAddress) {
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function createGoFundMeContract(uint256 minUsd) public {
        GoFundMe fund = new GoFundMe(minUsd, priceFeed, msg.sender);
        goFundMeArray.push(fund);
    }

    function getFundAmount(uint256 fundIndex) public view returns (uint256) {
        GoFundMe fund = goFundMeArray[fundIndex];
        uint256 bal = address(fund).balance;
        return bal;
    }
}
