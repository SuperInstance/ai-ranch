#!/bin/bash

# ===========================================
# AI Ranch Health Check
# ===========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "AI Ranch Health Check"
echo "====================="

# Check if server is running
check_server() {
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Server is running${NC}"
        return 0
    else
        echo -e "${RED}✗ Server is not running${NC}"
        return 1
    fi
}

# Check API endpoints
check_api() {
    echo ""
    echo "Checking API endpoints..."
    
    # Species API
    if curl -s http://localhost:3000/api/ranch/species | grep -q "success"; then
        echo -e "${GREEN}✓ Species API${NC}"
    else
        echo -e "${RED}✗ Species API${NC}"
    fi
    
    # Tasks API
    if curl -s http://localhost:3000/api/ranch/tasks | grep -q "success"; then
        echo -e "${GREEN}✓ Tasks API${NC}"
    else
        echo -e "${RED}✗ Tasks API${NC}"
    fi
    
    # Evolution API
    if curl -s http://localhost:3000/api/ranch/evolution | grep -q "success"; then
        echo -e "${GREEN}✓ Evolution API${NC}"
    else
        echo -e "${RED}✗ Evolution API${NC}"
    fi
}

# Check dependencies
check_deps() {
    echo ""
    echo "Checking dependencies..."
    
    if command -v bun &> /dev/null; then
        echo -e "${GREEN}✓ Bun installed${NC}"
    else
        echo -e "${RED}✗ Bun not found${NC}"
    fi
    
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✓ Dependencies installed${NC}"
    else
        echo -e "${RED}✗ Dependencies not installed${NC}"
    fi
}

# Check configuration
check_config() {
    echo ""
    echo "Checking configuration..."
    
    if [ -f ".env" ]; then
        echo -e "${GREEN}✓ .env exists${NC}"
        
        if grep -q "your-" .env 2>/dev/null; then
            echo -e "${YELLOW}⚠ Some API keys not configured${NC}"
        else
            echo -e "${GREEN}✓ API keys configured${NC}"
        fi
    else
        echo -e "${RED}✗ .env not found${NC}"
    fi
}

# Main
main() {
    check_deps
    check_config
    check_server && check_api
    
    echo ""
    echo "Health check complete!"
}

main "$@"
