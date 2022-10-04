import { network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { networkConfig } from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployFundMeFactory: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId: number = network.config.chainId!

  let ethUsdPriceFeedAddress: string
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed!
  }

  const args: any[] = [ethUsdPriceFeedAddress]
  const goFundMeFactory = await deploy("GoFundMeFactory", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: 1
  })
  log("--------------Deployed-Factory--------------------")
  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    await verify(goFundMeFactory.address, args)
  }
}

export default deployFundMeFactory
deployFundMeFactory.tags = ["all", "factory"]
