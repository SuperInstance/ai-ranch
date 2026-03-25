#!/bin/bash

# ===========================================
# AI Ranch Environment Setup
# ===========================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Setting up AI Ranch environment...${NC}"

# Create .env from example if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env${NC}"
else
    echo -e "${GREEN}✓ .env exists${NC}"
fi

# Create necessary directories
mkdir -p data logs exports

echo -e "${GREEN}✓ Created data directories${NC}"

# Check for required API keys
echo ""
echo -e "${YELLOW}Checking configuration...${NC}"

if grep -q "your-openai-api-key" .env 2>/dev/null; then
    echo "⚠ OpenAI API key not configured"
    echo "  Edit .env and add your OPENAI_API_KEY"
fi

echo ""
echo -e "${GREEN}Environment setup complete!${NC}"
echo "Edit .env to add your API keys before starting the ranch."
