#!/bin/bash

# ===========================================
# AI Ranch Installation Script
# ===========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════╗"
echo "║          AI Ranch Installation            ║"
echo "║     Self-Evolving AI Agent System         ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# Check for Bun
check_bun() {
    echo -e "${YELLOW}Checking for Bun...${NC}"
    if command -v bun &> /dev/null; then
        BUN_VERSION=$(bun --version)
        echo -e "${GREEN}✓ Bun $BUN_VERSION found${NC}"
    else
        echo -e "${RED}✗ Bun not found${NC}"
        echo "Installing Bun..."
        curl -fsSL https://bun.sh/install | bash
        export PATH="$HOME/.bun/bin:$PATH"
        echo -e "${GREEN}✓ Bun installed${NC}"
    fi
}

# Check for Node.js (fallback)
check_node() {
    echo -e "${YELLOW}Checking for Node.js...${NC}"
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "${GREEN}✓ Node.js $NODE_VERSION found${NC}"
    else
        echo -e "${YELLOW}⚠ Node.js not found (optional)${NC}"
    fi
}

# Install dependencies
install_deps() {
    echo -e "${YELLOW}Installing dependencies...${NC}"
    bun install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
}

# Setup environment
setup_env() {
    echo -e "${YELLOW}Setting up environment...${NC}"
    if [ ! -f .env ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created .env from .env.example${NC}"
        echo -e "${YELLOW}⚠ Please edit .env with your API keys${NC}"
    else
        echo -e "${GREEN}✓ .env already exists${NC}"
    fi
}

# Verify installation
verify() {
    echo -e "${YELLOW}Verifying installation...${NC}"
    
    # Check if we can build
    if bun run build 2>/dev/null; then
        echo -e "${GREEN}✓ Build successful${NC}"
    else
        echo -e "${RED}✗ Build failed${NC}"
        exit 1
    fi
}

# Print success message
success() {
    echo -e "${GREEN}"
    echo "╔═══════════════════════════════════════════╗"
    echo "║       Installation Complete! 🎉           ║"
    echo "╠═══════════════════════════════════════════╣"
    echo "║                                           ║"
    echo "║  Next steps:                              ║"
    echo "║  1. Edit .env with your API keys          ║"
    echo "║  2. Run 'bun run dev' to start            ║"
    echo "║  3. Open http://localhost:3000            ║"
    echo "║                                           ║"
    echo "╚═══════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Main installation
main() {
    check_bun
    check_node
    install_deps
    setup_env
    verify
    success
}

# Run main
main "$@"
