const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { QBusinessClient, ChatCommand, CreateConversationCommand } = require('@aws-sdk/client-qbusiness');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'https://yy2025-program.github.io'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));

// Initialize Amazon Q Business client
const qClient = new QBusinessClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'Amazon Q API Proxy'
    });
});

// Create conversation endpoint
app.post('/api/amazon-q/conversation', async (req, res) => {
    try {
        const command = new CreateConversationCommand({
            applicationId: process.env.AMAZON_Q_APP_ID,
            userId: req.body.userId || 'logistics-hub-user'
        });
        
        const response = await qClient.send(command);
        
        res.json({
            conversationId: response.conversationId,
            success: true
        });
    } catch (error) {
        console.error('Create conversation error:', error);
        res.status(500).json({ 
            error: 'Failed to create conversation',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Chat endpoint
app.post('/api/amazon-q/chat', async (req, res) => {
    try {
        const { message, conversationId, userId = 'logistics-hub-user' } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.AMAZON_Q_APP_ID) {
            return res.status(500).json({ error: 'Amazon Q application not configured' });
        }

        const command = new ChatCommand({
            applicationId: process.env.AMAZON_Q_APP_ID,
            conversationId: conversationId,
            message: message,
            userId: userId,
            // Optional: Add context or filters
            attributeFilter: {
                // You can add filters here based on your needs
            }
        });
        
        const response = await qClient.send(command);
        
        res.json({
            message: response.systemMessage || response.userMessage || 'No response received',
            conversationId: response.conversationId,
            messageId: response.systemMessageId,
            success: true,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Amazon Q API Error:', error);
        
        // Handle specific AWS errors
        if (error.name === 'AccessDeniedException') {
            res.status(403).json({ 
                error: 'Access denied to Amazon Q service',
                details: 'Please check your AWS credentials and permissions'
            });
        } else if (error.name === 'ResourceNotFoundException') {
            res.status(404).json({ 
                error: 'Amazon Q application not found',
                details: 'Please verify your application ID'
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to get response from Amazon Q',
                details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Amazon Q API Proxy running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🤖 Chat endpoint: http://localhost:${PORT}/api/amazon-q/chat`);
    
    // Log configuration status
    console.log('\n📋 Configuration Status:');
    console.log(`   AWS Region: ${process.env.AWS_REGION || 'us-east-1'}`);
    console.log(`   Amazon Q App ID: ${process.env.AMAZON_Q_APP_ID ? '✅ Configured' : '❌ Missing'}`);
    console.log(`   AWS Credentials: ${process.env.AWS_ACCESS_KEY_ID ? '✅ Configured' : '❌ Missing'}`);
});
