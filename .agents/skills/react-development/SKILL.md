---
name: React Development
description: Engineering guidelines for React, Vite, and TypeScript applications.
---

# React Development Skill

This skill provides guidelines for building production-ready React applications using Vite and TypeScript.

## Core Principles
1. **Component Modularity**: Keep components small, reusable, and focused on a single responsibility.
2. **State Management**: Use local state (`useState`) where possible. Use Context API for global state (e.g., Auth). Avoid Redux unless state becomes highly complex.
3. **TypeScript Usage**: Heavily rely on TypeScript for catching runtime errors early. Define strict interfaces for API responses and Props.
4. **Styling**: Use utility-first CSS (Tailwind CSS) for scalable, maintainable styling.
5. **Routing**: Use React Router for client-side routing. Use protected routes to restrict authenticated content.
6. **Performance**: Avoid unnecessary re-renders. Use `useMemo` and `useCallback` when passing heavy dependencies down the component tree.
