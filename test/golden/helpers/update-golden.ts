// Regenerates the golden fixtures from the CURRENT implementation.
// Run only when a wire-format change is intentional: npm run golden:update
process.env.TZ = 'UTC';

import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';
import {AxiosResponse} from 'axios';
import {buildGoldenEnvelope} from './envelope';
import {parseResponse} from '../../../src/responses';

const FIXTURES = join(__dirname, '..', '__fixtures__');

const updateResponseGolden = async (xmlName: string, goldenName: string) => {
    const xml = readFileSync(join(FIXTURES, xmlName), 'utf8');
    const parsed = await parseResponse({data: xml} as AxiosResponse);
    writeFileSync(join(FIXTURES, goldenName), JSON.stringify(parsed, null, 2) + '\n');
};

(async () => {
    writeFileSync(join(FIXTURES, 'request-envelope.golden.xml'), buildGoldenEnvelope());
    await updateResponseGolden('response-query.xml', 'response-query.golden.json');
    await updateResponseGolden('response-multi-query.xml', 'response-multi-query.golden.json');
    await updateResponseGolden('response-insert.xml', 'response-insert.golden.json');
    console.log('Golden fixtures updated. Review the diff carefully before committing.');
})();
