// {chainId : {name, eth/usd oracle address}}
export const networkConfig: {
  [key: number]: { name: string; ethUsdPriceFeed: string }
} = {
  4: {
    name: "rinkeby",
    ethUsdPriceFeed: "0x1234"
  },
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
  }
}
