const AWS = require('aws-sdk');

class TestProviderConfigurator {
    static configure() {
        AWS.config.update({
            region: 'us-east-1',
            endpoint: 'http://localhost:8001'
        });
    }
}

module.exports = TestProviderConfigurator;
