import {describe, expect, test} from '@jest/globals';
import {readFileSync} from 'fs';
import {join} from 'path';
import {buildGoldenEnvelope} from './helpers/envelope';

/**
 * Locks the request envelope byte-for-byte. If this test fails, the SDK
 * would send different XML to live Fidelio servers than before your
 * change — make sure that is intentional before regenerating the
 * fixture (npm run golden:update).
 */
describe('Golden: request envelope', () => {

    test('getBody() matches the golden XML byte for byte', () => {
        const golden = readFileSync(join(__dirname, '__fixtures__', 'request-envelope.golden.xml'), 'utf8');
        expect(buildGoldenEnvelope()).toBe(golden);
    });

});
