module.exports = {
    preset:               "ts-jest",
    testEnvironment:      "node",
    moduleFileExtensions: [
        "js",
        "json",
        "ts",
    ],
    rootDir:   ".",
    testRegex: ".*\\.(spec|test)\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },
    setupFilesAfterEnv:  [ "<rootDir>/test/setup.ts" ],
    // Coverage
    collectCoverageFrom: [
        "<rootDir>/src/**/*.(t|j)s",
        "!<rootDir>/node_modules/",
    ],
    coverageDirectory: "<rootDir>/coverage",
    coverageReporters: [
        "clover",
        "json",
        "lcov",
        "html",
        [ "text", { skipFull: true }],
    ],
    coverageThreshold: {
        global: {
            branches:   90,
            functions:  90,
            lines:      90,
            statements: 90,
        },
    },
};
