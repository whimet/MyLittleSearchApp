module.exports = {
    globals: {
        'ts-jest': {
            diagnostics: true
        }
    },
    roots: [
        '<rootDir>/src/',
        '<rootDir>/test/'
    ],
    preset: 'ts-jest',
    testEnvironment: 'node',
};
