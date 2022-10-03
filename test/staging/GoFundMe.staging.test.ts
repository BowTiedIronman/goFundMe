import { network } from "hardhat"

network.config.chainId === 31337
  ? describe.skip
  : describe("GoFundMe Staging", () => {})
