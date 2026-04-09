# WebExplorer - Frontend

A modern, high-performance web-based file explorer built with Vue 3, TypeScript, and Vite, adhering to Clean Architecture and SOLID principles.

## 🚀 Features

- **Intuitive Navigation**: Seamlessly browse through folder structures.
- **File Management**: Create, rename, and delete files/folders (integrated with Backend API).
- **Search & Filter**: Real-time searching with sorting capabilities (Name, Kind, Date).
- **Infinite Scrolling**: Optimized list viewing with auto-load more pagination.
- **Rich UI/UX**: Premium design with glassmorphism, smooth animations, and responsive layout.

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS with modern features (Variables, Grids, Flexbox)
- **State Management**: Vue Composables (Clean Architecture approach)
- **Testing**: Vitest for Unit and Integration tests

## 🏗️ Architecture

This project follows **Clean Architecture** principles to ensure maintainability and testability:

- **Domain**: Contains business logic, entities, and repository interfaces.
- **Infrastructure**: Handles external concerns like API calls and DTO mapping.
- **Application**: Coordinates use cases and service logic.
- **Presentation**: UI components, views, and state management (Composables).

## 📥 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
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

### Testing

Run unit and integration tests:
```bash
npm run test
```
