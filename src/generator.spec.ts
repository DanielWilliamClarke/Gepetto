
import { expect } from 'chai';
import 'mocha';
import Generator from './generator';

describe('Generator test', () => {

    it('should generate a string of length', () => {
        const length = 5;
        const code = new Generator().generate(length);
        expect(code.length).to.equal(length);
    });

    it('should generate an alpha numeric code', () => {
        const length = 5;
        const code = new Generator().generate(length);
        expect(code.length).to.match(/[0-9a-zA-Z]/);
    });
});
