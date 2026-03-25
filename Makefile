# AI Ranch Makefile
# Build, test, and deployment commands

.PHONY: all dev build clean lint test install help

# Default target
all: install build

# -------------------------------------------
# Development
# -------------------------------------------

dev:
	@echo "🚀 Starting development server..."
	bun run dev

install:
	@echo "📦 Installing dependencies..."
	bun install

# -------------------------------------------
# Build
# -------------------------------------------

build:
	@echo "🏗️ Building for production..."
	bun run build

clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf .next/
	rm -rf node_modules/
	rm -f bun.lock

# -------------------------------------------
# Quality
# -------------------------------------------

lint:
	@echo "🔍 Running linter..."
	bun run lint

typecheck:
	@echo "🔍 Type checking..."
	npx tsc --noEmit

format:
	@echo "✨ Formatting code..."
	npx prettier --write "src/**/*.{ts,tsx}"

# -------------------------------------------
# Testing
# -------------------------------------------

test:
	@echo "🧪 Running tests..."
	@echo "Tests not yet implemented"

test:watch:
	@echo "🧪 Running tests in watch mode..."
	@echo "Tests not yet implemented"

# -------------------------------------------
# Database
# -------------------------------------------

db:generate:
	@echo "📊 Generating Prisma client..."
	npx prisma generate

db:push:
	@echo "📊 Pushing schema to database..."
	npx prisma db push

db:migrate:
	@echo "📊 Running migrations..."
	npx prisma migrate dev

db:studio:
	@echo "📊 Opening Prisma Studio..."
	npx prisma studio

# -------------------------------------------
# Docker
# -------------------------------------------

docker:build:
	@echo "🐳 Building Docker image..."
	docker build -t ai-ranch:latest .

docker:run:
	@echo "🐳 Running Docker container..."
	docker run -p 3000:3000 ai-ranch:latest

docker:compose:
	@echo "🐳 Starting with Docker Compose..."
	docker-compose up -d

# -------------------------------------------
# Deployment
# -------------------------------------------

deploy:vercel:
	@echo "🚀 Deploying to Vercel..."
	vercel --prod

deploy:docker:
	@echo "🚀 Building and pushing Docker image..."
	docker build -t ai-ranch:latest .
	docker tag ai-ranch:latest registry.example.com/ai-ranch:latest
	docker push registry.example.com/ai-ranch:latest

# -------------------------------------------
# Utilities
# -------------------------------------------

size:
	@echo "📏 Checking build size..."
	@du -sh .next/ 2>/dev/null || echo "No build found"

deps:update:
	@echo "📦 Updating dependencies..."
	bun update

deps:audit:
	@echo "🔍 Auditing dependencies..."
	bun audit

env:setup:
	@echo "⚙️ Setting up environment..."
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ Created .env from .env.example"; \
	else \
		echo "⚠️ .env already exists"; \
	fi

# -------------------------------------------
# Help
# -------------------------------------------

help:
	@echo "AI Ranch Makefile Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev          Start development server"
	@echo "  make install      Install dependencies"
	@echo ""
	@echo "Build:"
	@echo "  make build        Build for production"
	@echo "  make clean        Clean build artifacts"
	@echo ""
	@echo "Quality:"
	@echo "  make lint         Run linter"
	@echo "  make typecheck    Type check"
	@echo "  make format       Format code"
	@echo ""
	@echo "Testing:"
	@echo "  make test         Run tests"
	@echo ""
	@echo "Database:"
	@echo "  make db:generate  Generate Prisma client"
	@echo "  make db:push      Push schema changes"
	@echo "  make db:studio    Open Prisma Studio"
	@echo ""
	@echo "Docker:"
	@echo "  make docker:build Build Docker image"
	@echo "  make docker:run   Run Docker container"
	@echo ""
	@echo "Utilities:"
	@echo "  make size         Check build size"
	@echo "  make deps:update  Update dependencies"
	@echo "  make env:setup    Setup .env file"
	@echo "  make help         Show this help"
