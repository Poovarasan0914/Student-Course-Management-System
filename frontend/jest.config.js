/** @type {import('jest').Config} */
export default {
    // Use jsdom environment for React testing
    testEnvironment: 'jsdom',

    // Setup files to run after Jest is initialized
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

    // Transform TypeScript and TSX files using ts-jest
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: 'tsconfig.test.json',
            },
        ],
    },

    // Module file extensions
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

    // Handle CSS imports (mock them)
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
    },

    // Test file patterns
    testMatch: ['**/__tests__/**/*.(ts|tsx)', '**/?(*.)+(spec|test).(ts|tsx)'],

    // Coverage configuration
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/main.tsx',
        '!src/vite-env.d.ts',
    ],

    // Use ESM
    extensionsToTreatAsEsm: ['.ts', '.tsx'],

    // Transform node_modules that use ESM
    transformIgnorePatterns: [
        'node_modules/(?!(.*\\.mjs$|@testing-library))',
    ],

    // Inject Jest globals
    injectGlobals: true,
};
