#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Test configuration
const config = {
    host: 'localhost',
    port: 3000,
    path: '/api/amazon-q/chat',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
};

const testMessage = {
    message: 'Hello Amazon Q, can you help me with FMS logistics?',
    conversationId: 'test-conversation-123',
    userId: 'test-user'
};

console.log('🧪 Testing Amazon Q API Integration');
console.log('===================================');
console.log(`📡 Endpoint: http://${config.host}:${config.port}${config.path}`);
console.log(`💬 Test Message: "${testMessage.message}"`);
console.log('');

// Test health endpoint first
const healthConfig = { ...config, path: '/health', method: 'GET' };
delete healthConfig.headers;

const healthReq = http.request(healthConfig, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('✅ Health check passed');
            console.log(`📊 Response: ${data}`);
            console.log('');
            
            // Now test the chat endpoint
            testChatEndpoint();
        } else {
            console.log(`❌ Health check failed: ${res.statusCode}`);
            console.log(`📊 Response: ${data}`);
        }
    });
});

healthReq.on('error', (error) => {
    console.log('❌ Health check error:', error.message);
    console.log('💡 Make sure the API server is running: cd api-proxy && npm start');
});

healthReq.end();

function testChatEndpoint() {
    const req = http.request(config, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`📡 Status Code: ${res.statusCode}`);
            console.log('📊 Response:');
            
            try {
                const jsonResponse = JSON.parse(data);
                console.log(JSON.stringify(jsonResponse, null, 2));
                
                if (res.statusCode === 200 && jsonResponse.success) {
                    console.log('');
                    console.log('🎉 Amazon Q API integration test PASSED!');
                    console.log('✅ Your API is working correctly');
                } else {
                    console.log('');
                    console.log('⚠️  API test completed with issues');
                    console.log('💡 Check your AWS credentials and Amazon Q configuration');
                }
            } catch (error) {
                console.log('Raw response:', data);
                console.log('❌ Failed to parse JSON response');
            }
        });
    });
    
    req.on('error', (error) => {
        console.log('❌ Chat API test error:', error.message);
        console.log('💡 Make sure the API server is running: cd api-proxy && npm start');
    });
    
    req.write(JSON.stringify(testMessage));
    req.end();
}

// Handle script termination
process.on('SIGINT', () => {
    console.log('\n👋 Test interrupted');
    process.exit(0);
});
