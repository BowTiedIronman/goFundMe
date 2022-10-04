import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { GoFundMeFactory } from "../../typechain-types"
import { assert } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

network.config.chainId !== 31337
  ? describe.skip
  : describe("GoFundMeFactory", () => {
      let goFundMeFactory: GoFundMeFactory
      let deployer: SignerWithAddress

      beforeEach(async function () {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        await deployments.fixture(["all"])
        goFundMeFactory = await ethers.getContract("GoFundMeFactory", deployer)
      })
      it("should create a gofundme contract", async () => {
        await goFundMeFactory.createGoFundMeContract(10)
        const fund = await goFundMeFactory.getFundAmount(0)
        assert(fund.toString(), "0")
      })
    })
