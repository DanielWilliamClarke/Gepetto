
import { expect } from 'chai';
import 'mocha';
import * as sinon from "sinon"

import ShortCode from "./shortcode";
import Generator from "./generator";

describe('ShortCode test', () => {

    it('should be able to covert url to shortcode', () => {

        const generatorMock = new Generator();
        const classUnderTest = new ShortCode(generatorMock);

        const inputUrl = "danielclarke.tech";
        const outputCode = "abcd3";

        const mock = sinon.mock(generatorMock);
        mock.expects("generate").returns(outputCode);

        const shortCode =  classUnderTest.urlToShortCode(inputUrl, 0);

        expect(shortCode).to.equal(outputCode);
    });

    it("should not recreate shortcode for the same url", () => {
        const generatorMock = new Generator();
        const classUnderTest = new ShortCode(generatorMock);

        const inputUrl = "danielclarke.tech";
        const outputCode = "abcd3"

        const mock = sinon.mock(generatorMock);
        mock.expects("generate").once().returns(outputCode);

        const shortCodeA =  classUnderTest.urlToShortCode(inputUrl, 0);
        const shortCodeB =  classUnderTest.urlToShortCode(inputUrl, 0);

        expect(shortCodeA).to.equal(shortCodeB);
    })

    it("should be able to convert shorcode to url", () => {
        const generatorMock = new Generator();
        const classUnderTest = new ShortCode(generatorMock);

        const inputUrl = "danielclarke.tech";
        const shortCode = "abcd3";

        const mock = sinon.mock(generatorMock);
        mock.expects("generate").returns(shortCode);

        classUnderTest.urlToShortCode(inputUrl, 100);
        const outputUrl = classUnderTest.shortCodeToUrl(shortCode);
        expect(outputUrl).to.equal(inputUrl);
    });

    it("should be able to react appropriately with invalid codes", () => {
        const shortCode = "abcd3";

        const generatorMock = new Generator();
        const classUnderTest = new ShortCode(generatorMock);

        const outputUrl = classUnderTest.shortCodeToUrl(shortCode);
        expect(outputUrl).to.equal(null);
    });

    it("should return null when code has expired", () => {
        const generatorMock = new Generator();
        const classUnderTest = new ShortCode(generatorMock);

        const inputUrl = "danielclarke.tech";
        const shortCode = "abcd3";

        const mock = sinon.mock(generatorMock);
        mock.expects("generate").returns(shortCode);

        const code = classUnderTest.urlToShortCode(inputUrl, -1000) as string;
        const outputUrl = classUnderTest.shortCodeToUrl(code) as null;
        expect(outputUrl).to.equal(null);
    });

    it("should return a new code when url has expired", () => {
        const generatorMock = new Generator();
        const classUnderTest = new ShortCode(generatorMock);

        const inputUrl = "danielclarke.tech";
        const firstCode = "abcd3";
        const secondCode = firstCode.split("").reverse().join("");

        const mock = sinon.mock(generatorMock);
        mock.expects("generate")
            .twice()
            .onFirstCall().returns(firstCode)
            .onSecondCall().returns(secondCode);

        const codeA = classUnderTest.urlToShortCode(inputUrl, -1000) as string;
        expect(codeA).to.equal(firstCode);

        const codeB = classUnderTest.urlToShortCode(inputUrl, 1000) as string;
        expect(codeB).to.equal(secondCode);
    });
});
