import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"

module.exports = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy, log } = hre.deployments
  // see hardhat.config.ts for explanation on deployer address and getNamedAccounts
  const { deployer } = await hre.getNamedAccounts()
  const chainId = network.config.chainId
  if (!chainId) return

  const args: any[] = []
  const goFundMe = await deploy("GoFundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: 1
  })
  log("----------------------------------")
}

module.exports.tags = ["all", "fundme"]
