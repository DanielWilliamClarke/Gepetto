import { makeTaggedUnion } from "safety-match";
import Generator from "./generator";

type Config = {
    key: string;
    expiresOn: number;
}
type Mapping = Record<string, Config>
const Validity = makeTaggedUnion({
    Valid: (config: Config) => config,
    Missing: (key: string) => key,
    Expired: (key: string, config: Config) => ({ key, config }),
});

export default class ShortCode {
    constructor (
        private generator: Generator,
        private codeMap: Mapping = {},
        private urlMap: Mapping = {})
    {}

    urlToShortCode(url: string, expiresIn: number) {
        return this.validate(url,  this.urlMap)
            .match({
                Valid: (config: Config) => config.key,
                Missing: (url: string) => this.add(url, expiresIn),
                Expired: ({ key, config }: { key: string, config: Config }) => {
                    this.prune(this.urlMap, key, this.codeMap, config.key);
                    return this.add(url, expiresIn);
                }
            });    
    }

    shortCodeToUrl(code: string) {
        return this.validate(code,  this.codeMap)
            .match ({ 
                Valid: (config: Config) => config.key,
                Missing: (_: string) => null,
                Expired: ({ key, config }: { key: string, config: Config }) =>
                    this.prune(this.codeMap, key, this.urlMap, config.key),
            });
    }

    private validate (key: string, mapping: Mapping) {
        const config = mapping[key];
        if (!config) {
            return Validity.Missing(key);
        }
        if(Date.now() > config.expiresOn) {
            return Validity.Expired(key, config);
        }
        return Validity.Valid(config);
    }

    private prune (m1: Mapping, key1: string,  m2: Mapping, key2: string) {
        delete m1[key1];
        delete m2[key2];
        return null;
    }

    private add (url: string, expiresIn: number): string {
        const code = this.generator.generate(5);
        const expiresOn = Date.now() + expiresIn;
        this.codeMap[code] = { key: url,  expiresOn };
        this.urlMap[url] = { key: code, expiresOn };
        return code;
    }
}
