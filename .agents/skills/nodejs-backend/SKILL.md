---
name: Node.js Backend
description: Guidelines and best practices for Node.js, Express, and REST APIs.
---

# Node.js Backend Architecture

This skill defines the structural and architectural guidelines for building Express.js backend services.

## Architectural Layers
1. **Routes**: Define HTTP endpoints and map them to Controllers. Keep routes minimal.
2. **Controllers**: Handle HTTP request/response parsing, parameter validation, and status codes. Delegate business logic to Services.
3. **Services**: Contain all core business logic. Must be independent of HTTP abstractions.
4. **Repositories**: Abstract the data layer. Interfaces must be used to swap out implementations (e.g., In-Memory vs SQL).
5. **Storage**: Define Models (e.g., Sequelize/Postgres) and perform actual DB queries.

## Security & Best Practices
- **Authentication**: Use JWT tokens with secure lifetimes. Never store plain text passwords; use bcrypt.
- **Validation**: Validate all incoming parameters and request bodies using Zod.
- **Error Handling**: Implement global error handlers so that API crashes do not bring down the server.
