const CHAIN_ID = '3'
const GAS_PRICE = 1e-8
const NETWORK = `https://api.chainweb.com/chainweb/0.0/mainnet01/chain/${CHAIN_ID}/pact`
const TOKEN_1_CODE = 'coin'
const TOKEN_2_CODE = 'kdlaunch.token'
const DEF_LOWER_BOUND = 0.035
const DEF_UPPER_BOUND = 0.04
const DEF_INTERVAL = 30_000

module.exports = {
  CHAIN_ID,
  GAS_PRICE,
  NETWORK,
  TOKEN_1_CODE,
  TOKEN_2_CODE,
  DEF_LOWER_BOUND,
  DEF_UPPER_BOUND,
  DEF_INTERVAL
}
