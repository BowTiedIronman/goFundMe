// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";

library PriceConverter {
    function getLatestPrice(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        (, int price, , , ) = priceFeed.latestRoundData();
        return uint256(price); // 129158733925
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 price = getLatestPrice(priceFeed) / 10**8; //  1291.58733925
        uint256 value = (ethAmount * price) / (10**18);
        return value;
    }
}
