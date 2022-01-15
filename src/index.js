import Pact from "pact-lang-api";
import {
    CHAIN_ID,
    GAS_PRICE,
    LOWER_BOUND,
    NETWORK,
    TOKEN_1_CODE,
    TOKEN_2_CODE,
    UPPER_BOUND,
} from "./constants.js";
import { creationTime } from "./utils.js";
import notifier from 'node-notifier'
import fs from "fs";

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
                    "",
                    CHAIN_ID,
                    GAS_PRICE,
                    3000,
                    creationTime(),
                    600
                ),
            },
            NETWORK
        );
        const [_, { decimal: dec1 }, { decimal: dec2 }] = res.result.data;
        return dec1 / dec2;
    } catch (e) {
        console.error(e);
    }
};

setInterval(async () => {
    const ratio = await getRate();

    if (ratio <= LOWER_BOUND) {

    }

    if (ratio >= UPPER_BOUND) {

    }

    // TODO REFACTOR TO SEPARATE METHOD
    const date = new Date();
    fs.appendFileSync(
        "log.txt",
        `${date.getDate()}/${date.getMonth() + 1
        } ${date.getHours()}:${date.getMinutes()} -- ${ratio}\n`
    );

    // notifier.notify({
    //     title: 'Got new rate!',
    //     message: `the rate is ${ratio}`
    // })
}, 30_000);