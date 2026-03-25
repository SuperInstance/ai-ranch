# Contributing to AI Ranch

First off, thank you for considering contributing to AI Ranch! It's people like you that make AI Ranch such a great tool.

## 📜 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Format](#commit-message-format)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-ranch.git
   cd ai-ranch
   ```

### Development Setup

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Run linter
bun run lint

# Type check
npx tsc --noEmit

# Build for production
bun run build
```

## How to Contribute

### 🐛 Reporting Bugs

Before creating bug reports, please check the issue list as you might find that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed and what you expected
- Include screenshots if possible

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain the behavior you expected
- Explain why this enhancement would be useful

### 🧬 Contributing a New Species

We welcome contributions of new species! To contribute:

1. Create your breed.md file following the template in `templates/`
2. Add it to the `templates/` directory with a descriptive name
3. Update the `templates/README.md` documentation
4. Open a PR with the label `new-species`

Example breed.md:

```markdown
# species
cattle

# name
Email Analyst

# description
Specialized agent for email processing and analysis

# capabilities
- email_processing (weight: 1.0)
- analysis (weight: 0.9)

# personality
tone: professional
creativity: 0.3

# model
temperature: 0.5
max_tokens: 1024
```

### 📚 Improving Documentation

Documentation improvements are always welcome:

- Fix typos or clarify confusing sections
- Add missing documentation
- Improve code examples
- Translate documentation

## Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/my-new-feature
   # or
   git checkout -b fix/my-bug-fix
   ```

2. **Make Your Changes**
   - Follow our coding standards
   - Add/update tests as needed
   - Update documentation

3. **Commit Your Changes**
   ```bash
   git commit -m "feat: add amazing new feature"
   ```

4. **Push to Your Fork**
   ```bash
   git push origin feature/my-new-feature
   ```

5. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

6. **Code Review**
   - Respond to review comments
   - Make requested changes
   - Keep the PR up to date with main

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Prefer `interface` over `type` for object shapes
- Use `const` for variables that don't change
- Use meaningful variable names

### React

- Use functional components with hooks
- Use `'use client'` directive for client components
- Keep components small and focused
- Use shadcn/ui components when possible

### Styling

- Use Tailwind CSS utility classes
- Follow the existing color scheme
- Ensure responsive design
- Support dark mode

### File Organization

```
feature/
├── components/
│   ├── FeatureComponent.tsx
│   └── index.ts
├── hooks/
│   └── useFeature.ts
├── types/
│   └── feature.ts
└── utils/
    └── feature.ts
```

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Changes that do not affect the meaning of the code |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `perf` | A code change that improves performance |
| `test` | Adding missing tests or correcting existing tests |
| `chore` | Changes to the build process or auxiliary tools |

### Examples

```
feat(species): add new falcon species for fast search
fix(collie): resolve routing decision caching issue
docs(readme): update installation instructions
style(dashboard): improve species panel spacing
refactor(evolution): simplify fitness calculation
perf(tasks): optimize task queue processing
test(species): add unit tests for species registry
chore(ci): update GitHub Actions workflow
```

---

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

Thank you for contributing! 🎉
