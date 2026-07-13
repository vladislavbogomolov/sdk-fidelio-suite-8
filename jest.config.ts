import type {Config} from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/test/jest.setup.ts'],
    testTimeout: 60000,
};

export default config;
