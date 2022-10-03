import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { networkConfig } from "../helper-hardhat-config"

module.exports = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy, log, get } = hre.deployments
  // see hardhat.config.ts for explanation on deployer address and getNamedAccounts
  const { deployer } = await hre.getNamedAccounts()
  const chainId = network.config.chainId
  if (!chainId) return

  let ethUsdPriceFeedAddress

  if (chainId === 31337) {
    const ethUsdAggregator = await get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
  }

  const minUsd = 50
  const args: any[] = [minUsd, ethUsdPriceFeedAddress]
  const goFundMe = await deploy("GoFundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: 1
  })
  log("----------------------------------")
}

module.exports.tags = ["all", "fundme"]
