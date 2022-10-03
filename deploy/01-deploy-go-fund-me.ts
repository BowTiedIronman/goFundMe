import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { networkConfig } from "../helper-hardhat-config"
import verify from "../utils/verify"

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

  const minUsd = 10
  const args: any[] = [minUsd, ethUsdPriceFeedAddress]
  const goFundMe = await deploy("GoFundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: 5
  })
  log("----------------------------------")
  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    await verify(goFundMe.address, args)
  }
}

module.exports.tags = ["all", "fundme"]
