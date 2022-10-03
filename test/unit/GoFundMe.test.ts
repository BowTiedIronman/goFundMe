import { deployments, ethers, getNamedAccounts } from "hardhat"
import { GoFundMe } from "../../typechain-types"
import { assert, expect } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

describe("GoFundMe", () => {
  let goFundMe: GoFundMe
  let goFundMeOtherWallet: GoFundMe
  let deployer: SignerWithAddress
  let otherWallet: SignerWithAddress

  const sendValue = ethers.utils.parseEther("2")

  beforeEach(async function () {
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    otherWallet = accounts[1]
    await deployments.fixture(["all"])
    goFundMe = await ethers.getContract("GoFundMe", deployer)
    console.log({ goFundMe })
  })

  describe("constructor", () => {
    it("should set i_owner", async () => {
      const response = await goFundMe.getOwner()

      assert.equal(response, deployer.address)
    })
  })

  describe("fund", () => {
    beforeEach(async () => {
      await goFundMe.fund({ value: sendValue })
    })

    it("updates the amount in map", async () => {
      const response = await goFundMe.s_addressToAmountFunded(deployer.address)
      assert.equal(response.toString(), sendValue.toString())
    })
  })
  describe("withdraw", () => {
    beforeEach(async () => {
      await goFundMe.fund({ value: sendValue })
    })
    it("should only allow owner to withdraw", async () => {
      const contractBalance = await await goFundMe.provider.getBalance(
        goFundMe.address
      )
      const deployerBalance = await await goFundMe.provider.getBalance(
        deployer.address
      )
      const transactionResponse = await goFundMe.withdraw()
      const transactionReceipt = await transactionResponse.wait(1)
      const { gasUsed, effectiveGasPrice } = transactionReceipt
      const gasCost = gasUsed.mul(effectiveGasPrice)

      const withdrawedContractBalance =
        await await goFundMe.provider.getBalance(goFundMe.address)
      const withdrawedDeployerBalance =
        await await goFundMe.provider.getBalance(deployer.address)
      const startVal = withdrawedDeployerBalance.add(gasCost).toString()

      assert.equal(
        startVal.toString(),
        deployerBalance.add(sendValue).toString()
      )
    })
    it("should not allow to withdraw from other acccounts", async () => {
      beforeEach(async () => {
        await goFundMe.fund({ value: sendValue })
        goFundMeOtherWallet = await ethers.getContract("GoFundMe", otherWallet)
      })
      await expect(goFundMeOtherWallet.withdraw()).to.be.reverted
    })
  })
})
