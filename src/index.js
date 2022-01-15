import { formatRateInfo, getParam } from "./utils.js";
import { DEF_INTERVAL, DEF_LOWER_BOUND, DEF_UPPER_BOUND } from "./constants.js";
import notifier from "node-notifier";
import fs from "fs";
import path from "path";

const LOWER_BOUND = parseFloat(getParam("-l")) || DEF_LOWER_BOUND;
const UPPER_BOUND = parseFloat(getParam("-u")) || DEF_UPPER_BOUND;
const INTERVAL = parseInt(getParam("-i")) || DEF_INTERVAL;

console.clear();
console.log(
  "\x1b[32m%s\x1b[0m",
  `Logging changes into ${path.join(process.cwd(), "log.txt")}
You can stop the app with CTRL-C...
`
);

let prevHitLower = false;
let prevHitUpper = false;

setInterval(async () => {
  const ratio = await getRate();

  if (ratio <= LOWER_BOUND && !prevHitLower) {
    prevHitLower = true;
    notifier.notify({
      title: "The ratio reached the lower bound!",
      message: `Current ratio: ${ratio}`,
    });
  } else if (ratio > LOWER_BOUND) {
    prevHitLower = false;
  }

  if (ratio >= UPPER_BOUND && !prevHitUpper) {
    prevHitUpper = true;
    notifier.notify({
      title: "The ratio reached the upper bound!",
      message: `Current ratio: ${ratio}`,
    });
  } else if (ratio < UPPER_BOUND) {
    prevHitUpper = false;
  }

  fs.appendFileSync("log.txt", formatRateInfo(ratio));
}, INTERVAL);
