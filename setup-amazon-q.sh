#!/bin/bash

echo "🚀 Amazon Q API Integration Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm found: $(npm --version)${NC}"

# Navigate to API proxy directory
cd api-proxy

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}📝 Please edit .env file with your AWS credentials and Amazon Q App ID${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Setup Instructions:${NC}"
echo "1. Edit api-proxy/.env file with your AWS credentials"
echo "2. Set your Amazon Q Application ID"
echo "3. Run: cd api-proxy && npm start"
echo "4. Update frontend config to use real API"
echo ""

echo -e "${BLUE}📋 Required Environment Variables:${NC}"
echo "   AWS_ACCESS_KEY_ID=your_access_key"
echo "   AWS_SECRET_ACCESS_KEY=your_secret_key"
echo "   AMAZON_Q_APP_ID=your_app_id"
echo ""

echo -e "${BLUE}🚀 To start the API server:${NC}"
echo "   cd api-proxy"
echo "   npm start"
echo ""

echo -e "${BLUE}🌐 To enable real API in frontend:${NC}"
echo "   Edit index.html and set: useDemo: false"
echo ""

echo -e "${GREEN}✅ Setup complete!${NC}"
