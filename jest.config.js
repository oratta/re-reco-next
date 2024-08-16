const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    moduleDirectories: ['node_modules', '<rootDir>/'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'node',
};

module.exports = createJestConfig(customJestConfig);