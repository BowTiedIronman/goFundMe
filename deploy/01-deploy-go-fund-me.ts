import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../utils/verify"
import { networkConfig } from "../helper-hardhat-config"

const deployFundMe: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  console.log("-----deploy-contract------")
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

  const minUsd = 10
  const args: any[] = [minUsd, ethUsdPriceFeedAddress, deployer]
  const goFundMe = await deploy("GoFundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: 1
  })
  log("-------------Deployed-Go-Fund-Me---------------------")
  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    await verify(goFundMe.address, args)
  }
}

export default deployFundMe
//  tags are useful when you dont want to deploy all scripts
// yarn hardhat deploy --netowrk rinkeby --tags fundMe
deployFundMe.tags = ["all", "fundMe"]
