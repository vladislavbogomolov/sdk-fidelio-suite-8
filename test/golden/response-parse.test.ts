import {describe, expect, test} from '@jest/globals';
import {readFileSync} from 'fs';
import {join} from 'path';
import {AxiosResponse} from 'axios';
import {parseResponse} from '../../src/responses';
import {FidelioError} from '../../src';

const fixture = (name: string): string =>
    readFileSync(join(__dirname, '__fixtures__', name), 'utf8');

const parse = (name: string) =>
    parseResponse({data: fixture(name)} as AxiosResponse);

const golden = (name: string): any =>
    JSON.parse(fixture(name));

/**
 * Locks response normalization: type coercion, date handling, the
 * context dispatch table (Notes, Membership, Package, CustomField,
 * Communications, Addresses, PersonalDocument, AccompanyingGuest) and
 * the single/multi-query return contract.
 */
describe('Golden: response parsing', () => {

    test('single query response matches golden JSON', async () => {
        expect(await parse('response-query.xml')).toEqual(golden('response-query.golden.json'));
    });

    test('multi query response returns an array per query', async () => {
        expect(await parse('response-multi-query.xml')).toEqual(golden('response-multi-query.golden.json'));
    });

    test('insert response matches golden JSON', async () => {
        expect(await parse('response-insert.xml')).toEqual(golden('response-insert.golden.json'));
    });

    test('non-OK status rejects with FidelioError (status kept, newlines collapsed)', async () => {
        await expect(parse('response-error.xml')).rejects.toBeInstanceOf(FidelioError);
        await expect(parse('response-error.xml')).rejects.toMatchObject({
            name: 'FidelioError',
            status: 'NG',
            message: 'Guest not found second line',
        });
    });

    test('empty rows: plain query yields undefined, AvailabilityForWeb yields []', async () => {
        expect(await parse('response-empty-reservation.xml')).toBeUndefined();
        expect(await parse('response-empty-availability.xml')).toEqual([]);
    });

});
