const path = require('path');
const fs = require('fs');

describe('jest.config.js validation', () => {
    it('should fail if coverageReporters.text is set to true', () => {
        // Define the path to the jest.config.js file
        const jestConfigPath = path.resolve(__dirname, 'jest.config.js');

        // Check if the file exists
        if (!fs.existsSync(jestConfigPath)) {
            throw new Error('jest.config.js file not found');
        }

        // Require the jest.config.js file to load it
        const jestConfig = require(jestConfigPath);

        // Ensure coverageReporters exists and check for 'text' being true
        const coverageReporters = jestConfig.coverageReporters || [];

        let textReporterEnabled = false;

        // Handle case where coverageReporters is an array or an object
        if (Array.isArray(coverageReporters)) {
            // In array format, check if 'text' exists in the array
            textReporterEnabled = coverageReporters.includes('text');
        } else if (typeof coverageReporters === 'object') {
            // In object format, check if 'text' is explicitly set to true
            textReporterEnabled = coverageReporters.text === true;
        }

        // Fail the test if 'text' is set to true
        if (textReporterEnabled) {
            throw new Error("Test failed: 'coverageReporters.text' is set to true.");
        }
    });
});
