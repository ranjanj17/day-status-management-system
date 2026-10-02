---
name: System Design
description: Principles for scalable, secure, and maintainable application design.
---

# System Design Guidelines

## Core Tenets
1. **Separation of Concerns (SoC)**: Ensure distinct boundaries between the frontend (UI/UX) and the backend (API/Data).
2. **Database Design**: Model databases with clear entity relationships. Utilize constraints (e.g., Unique on dates) and indexes to guarantee data integrity at the lowest level.
3. **Storage Abstraction**: Decouple the business logic from the underlying storage mechanism using the Repository Pattern.
4. **Scalability**: Avoid N+1 queries. Build RESTful APIs that return aggregated data appropriately without requiring excessive client requests.
5. **Stateless APIs**: The backend must remain stateless (e.g., using JWTs) to allow horizontal scaling.
