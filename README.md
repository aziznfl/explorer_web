# WebExplorer - Frontend

A modern, high-performance web-based file explorer built with Vue 3, TypeScript, and Vite, adhering to Clean Architecture and SOLID principles.

## 🚀 Features

- **Intuitive Navigation**: Seamlessly browse through folder structures.
- **File Management**: Create, rename, and delete files/folders (integrated with Backend API).
- **Search & Filter**: Real-time searching with sorting capabilities (Name, Kind).
- **Infinite Scrolling**: Optimized list viewing with auto-load more pagination using Intersection Observer.
- **Rich UI/UX**: Premium design with glassmorphism, smooth animations, and responsive layout.

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS (Variables, Grids, Flexbox)
- **Testing**: [Vitest](https://vitest.dev/) for Unit and Integration testing, [Playwright](https://playwright.dev/) for E2E.

## 🏗️ Architecture

This project follows **Clean Architecture** principles to ensure maintainability and testability:

- **Domain**: Pure business logic, entities, and repository interfaces.
- **Infrastructure**: Data access (API clients, DTO mappers, and Repository implementations).
- **Application**: Service layer that coordinates business rules.
- **Presentation**: UI components, views, and stateful logic via Composables.

## 📥 Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   ```bash
   cp .env.example .env
   ```

### Development

Run the development server:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

## 🧪 Testing

The project uses a robust testing suite covering unit to integration levels.

### Unit & Integration Tests
Run all tests once:
```bash
npm test
```

Run in watch mode:
```bash
npm run test:unit
```

### E2E Tests
```bash
npm run test:e2e
```

> [!NOTE]
> Testing requires global stubs for browser APIs (like `IntersectionObserver`) which are configured in `tests/setup.ts`.

## ✨ Design Aesthetics

- **Glassmorphism**: Subtle translucent backgrounds with blur effects.
- **Micro-animations**: Smooth transitions for folder opening and item selection.
- **Responsive Grid**: Fluid layout that adapts to all screen sizes.
- **Premium Typography**: Modern fonts for a high-end feel.
