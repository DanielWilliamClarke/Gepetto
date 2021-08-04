import Generator from "./src/generator"
import ShortCode from "./src/shortcode"

const generator = new Generator();
const shortCode = new ShortCode(generator);

const url = "danielclarke.tech";
const code = shortCode.urlToShortCode(url, 1000);

// tslint:disable-next-line: no-console#
console.log(`${url} -> ${code}`);
