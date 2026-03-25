#!/bin/bash

# ===========================================
# AI Ranch Benchmark Script
# ===========================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "═══════════════════════════════════════════"
echo "       AI Ranch Performance Benchmark       "
echo "═══════════════════════════════════════════"
echo -e "${NC}"

# Check if server is running
check_server() {
    if curl -s http://localhost:3000/api/ranch/species > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Server is running${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Server not running, starting...${NC}"
        bun run dev &
        sleep 5
        return 1
    fi
}

# Benchmark species API
benchmark_species() {
    echo ""
    echo -e "${YELLOW}Benchmarking Species API...${NC}"
    
    START=$(date +%s%N)
    for i in {1..10}; do
        curl -s http://localhost:3000/api/ranch/species > /dev/null
    done
    END=$(date +%s%N)
    
    TOTAL=$(( ($END - $START) / 1000000 ))
    AVG=$(( $TOTAL / 10 ))
    
    echo "  Total: ${TOTAL}ms for 10 requests"
    echo "  Average: ${AVG}ms per request"
}

# Benchmark task creation
benchmark_tasks() {
    echo ""
    echo -e "${YELLOW}Benchmarking Task API...${NC}"
    
    START=$(date +%s%N)
    for i in {1..5}; do
        curl -s -X POST http://localhost:3000/api/ranch/tasks \
            -H "Content-Type: application/json" \
            -d '{"content": "Test task '$i'"}' > /dev/null
    done
    END=$(date +%s%N)
    
    TOTAL=$(( ($END - $START) / 1000000 ))
    AVG=$(( $TOTAL / 5 ))
    
    echo "  Total: ${TOTAL}ms for 5 requests"
    echo "  Average: ${AVG}ms per request"
}

# Benchmark evolution
benchmark_evolution() {
    echo ""
    echo -e "${YELLOW}Benchmarking Evolution API...${NC}"
    
    START=$(date +%s%N)
    curl -s -X POST http://localhost:3000/api/ranch/evolution > /dev/null
    END=$(date +%s%N)
    
    TOTAL=$(( ($END - $START) / 1000000 ))
    
    echo "  Evolution cycle: ${TOTAL}ms"
}

# Memory usage
check_memory() {
    echo ""
    echo -e "${YELLOW}Memory Usage...${NC}"
    
    if command -v ps &> /dev/null; then
        # Find node/bun process
        MEM=$(ps aux | grep -E "(node|bun)" | grep -v grep | awk '{sum+=$6} END {print sum/1024}')
        if [ -n "$MEM" ]; then
            echo "  Process memory: ${MEM}MB"
        else
            echo "  No running process found"
        fi
    fi
}

# Run benchmarks
main() {
    SERVER_STARTED=$(check_server)
    
    benchmark_species
    benchmark_tasks
    benchmark_evolution
    check_memory
    
    echo ""
    echo -e "${GREEN}Benchmark complete!${NC}"
    
    # Cleanup if we started the server
    if [ "$SERVER_STARTED" != "0" ]; then
        echo "Stopping server..."
        pkill -f "bun run dev" || true
    fi
}

main "$@"
