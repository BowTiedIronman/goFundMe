import { assert } from "chai"
import { ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { GoFundMe } from "../../typechain-types"

network.config.chainId === 31337
  ? describe.skip
  : describe("FundMe Staging Tests", async function () {
      console.log("running staging on chainid ")
      let fundMe: GoFundMe
      let deployer: SignerWithAddress

      const sendValue = ethers.utils.parseEther("0.05")
      beforeEach(async function () {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        fundMe = await ethers.getContract("GoFundMe", deployer.address)
      })

      it("Allows people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue })
        await fundMe.withdraw({
          gasLimit: 100000
        })
        const endingFundMeBalance = await fundMe.provider.getBalance(
          fundMe.address
        )
        console.log(
          endingFundMeBalance.toString() +
            " should equal 0, running assert equal..."
        )
        assert.equal(endingFundMeBalance.toString(), "0")
      })
    })
