---
name: Software Engineering
description: Rules for testing, version control, and code maintainability.
---

# Software Engineering Practices

## Testing
- **Backend**: Implement integration and unit tests using Vitest and Supertest. Test both happy and unhappy paths (e.g., authentication failures, invalid inputs).
- **Environment Isolation**: Always use isolated databases or In-Memory stores for tests.

## Version Control (Git)
- Make small, atomic commits using conventional commit messages (`feat:`, `fix:`, `chore:`, `test:`, `docs:`).
- Push to clear remote branches (e.g., `main`).

## Documentation
- Maintain a comprehensive `README.md` that acts as the single source of truth for onboarding.
- Comment complex algorithms (like Date/Leap Year calculations) but omit trivial syntax explanations.

## Code Quality
- Enforce strict typing with TypeScript.
- Rely on linting and format checks to guarantee consistent code styles across all developers.
