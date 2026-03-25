# Changelog

All notable changes to AI Ranch will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation for all directories
- GitHub Actions CI/CD workflows
- Issue templates for bugs, features, and new species
- Pull request template
- Contributing guidelines
- Roadmap document

### Changed
- Enhanced README with detailed feature descriptions

## [0.3.0] - 2024-03-25

### Added
- **Species Registry**: 8 specialized agent types (Cattle, Duck, Goat, Sheep, Horse, Falcon, Hog, Chicken)
- **Collie Orchestrator**: Intelligent intent routing with keyword matching
- **breed.md DNA System**: Markdown-based agent configuration
- **Night School Evolution**: 6-phase evolution cycle (evaluate, cull, breed, distill, quarantine, promote)
- **Web Dashboard**: Real-time monitoring interface with React and Tailwind CSS
  - Species Panel: View and manage species
  - Task Panel: Create and monitor tasks
  - Evolution Panel: Control Night School
- **REST API**: Complete CRUD endpoints for species, tasks, and evolution
- **Documentation**: API reference and quick start guide
- **Templates**: 3 breed.md templates (email-analyst, quick-search, data-pipeline)

### Technical Details
- Built with Next.js 15 and TypeScript 5
- UI components from shadcn/ui (Radix + Tailwind)
- Singleton pattern for core classes
- Event subscription system for real-time updates

## [0.2.0] - 2024-02-15

### Added
- Basic species definitions
- Simple routing logic
- breed.md parser prototype

### Changed
- Refactored project structure

## [0.1.0] - 2024-01-15

### Added
- Initial project structure
- Basic Next.js setup
- Core type definitions

---

## Version Naming Convention

- **Major (X.0.0)**: Breaking changes, major features
- **Minor (0.X.0)**: New features, backward compatible
- **Patch (0.0.X)**: Bug fixes, minor improvements

## Categories

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.
