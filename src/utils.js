const Pact = require('pact-lang-api')
const {
  CHAIN_ID,
  GAS_PRICE,
  NETWORK,
  TOKEN_1_CODE,
  TOKEN_2_CODE
} = require('./constants.js')
const path = require('path')

const creationTime = () => Math.round(new Date().getTime() / 1000) - 10

/**
 * Returns value after the specified parameter name in `process.argv`.
 * @param {string} paramName name of the desired parameter
 * @returns {string | undefined}
 */
const getParam = (paramName) => {
  const index = process.argv.findIndex((val) => val === paramName)
  if (index === -1) return
  return process.argv[index + 1]
}

/**
 * Adds date info to the current ratio.
 * @param {number} ratio
 * @returns {string}
 */
const formatRateInfo = (ratio) => {
  const date = new Date()
  return `${date.getDate()}/${
    date.getMonth() + 1
  } ${date.getHours()}:${date.getMinutes()} -- ${ratio}\n`
}

/**
 * Gets the current rate between `KDA` and `KDL`.
 * @returns {Promise<number>}
 */
const getRate = async () => {
  try {
    const res = await Pact.fetch.local(
      {
        pactCode: `
        (use free.exchange)
        (let*
          (
            (p (get-pair ${TOKEN_1_CODE} ${TOKEN_2_CODE}))
            (reserveA (reserve-for p ${TOKEN_1_CODE}))
            (reserveB (reserve-for p ${TOKEN_2_CODE}))
            (totalBal (free.tokens.total-supply (free.exchange.get-pair-key ${TOKEN_1_CODE} ${TOKEN_2_CODE})))
            )[totalBal reserveA reserveB])
            `,
        meta: Pact.lang.mkMeta(
          '',
          CHAIN_ID,
          GAS_PRICE,
          3000,
          creationTime(),
          600
        )
      },
      NETWORK
    )
    const [, { decimal: dec1 }, { decimal: dec2 }] = res.result.data
    return dec1 / dec2
  } catch (e) {
    console.error(e)
  }
}

const consoleInfo = (lower, upper, interval) => {
  console.clear()
  console.log(
    `Using ${lower} as lower bound.
Using ${upper} as upper bound.
Getting new data every ${interval / 1000} seconds.`
  )
  console.log(
    '\x1b[32m%s\x1b[0m',
    `Logging rates into ${path.join(process.cwd(), 'log.txt')}`
  )
  console.log('\nYou can stop the app with CTRL-C...')
}

module.exports = {
  creationTime,
  getParam,
  formatRateInfo,
  getRate,
  consoleInfo
}
