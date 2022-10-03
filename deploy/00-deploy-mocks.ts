import { ethers, network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const DECIMALS = "18"
const INITIAL_PRICE = "129158733925" // https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419#readContract

//  mock price feed oracle in contracts/test/
module.exports = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy, log } = hre.deployments
  const { deployer } = await hre.getNamedAccounts()
  const chainId = network.config.chainId

  if (chainId == 31337) {
    log("local chain detected. using mocks...")
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE]
    })
    log("Mocks Deployed!")
    log("----------------------------------")
    log(
      "You are deploying to a local network, you'll need a local network running to interact"
    )
    log(
      "Please run `yarn hardhat console` to interact with the deployed smart contracts!"
    )
    log("----------------------------------")
  }
}

module.exports.tags = ["all", "mocks"]
