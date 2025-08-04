# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bento is a minimalist, elegant and hackable startpage inspired by the Bento box. It's a personalized new tab page built with TypeScript, Parcel, and nanostores.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (hot reload enabled)
npm run dev

# Build for production
npm run build

# Build with development settings (no optimization)
npm run build-dev

# Check bundle size
npm run size

# Clean build artifacts
npm run clean
```

## Architecture Overview

### Technology Stack
- **Build Tool**: Parcel v2
- **State Management**: nanostores with @nanostores/persistent for localStorage
- **Styling**: Pure CSS (reset.css, layout.css, chart.css)
- **Service Worker**: For offline capabilities
- **No Framework**: Vanilla TypeScript with direct DOM manipulation

### Core Architecture

1. **Entry Point**: `src/index.html` → `src/app.ts`
   - app.ts initializes all components and sets up subscriptions

2. **State Management Pattern**:
   - All state lives in nanostores (`src/nanostores/`)
   - Models define types and defaults (`src/models/`)
   - Views render state to HTML strings (`src/views/`)
   - Controllers handle user interactions (`src/controller/`)

3. **Main Components**:
   - **Time/Date Display**: Shows current time and date
   - **Greetings**: Personalized greetings based on time of day
   - **Weather Forecast**: Uses OpenWeatherMap API
   - **Local Links**: Custom widget system for local bookmarks
   - **Raindrop Links**: Integration with Raindrop.io bookmarks
   - **Settings**: Configurable via dialog, persisted to localStorage

4. **Widget System**:
   - Widgets are self-contained modules in `src/widgets/`
   - Each widget has: models.ts, store.ts, view.ts, index.ts
   - Example: local-links widget for managing local bookmarks

5. **Rendering Pattern**:
   - Uses `renderText()` helper for DOM updates
   - Views return HTML strings or DocumentFragments
   - No virtual DOM - direct DOM manipulation

6. **Data Persistence**:
   - Settings stored in localStorage via @nanostores/persistent
   - Key prefix: "settings:"
   - Automatic serialization/deserialization

## Key Files and Their Roles

- `src/app.ts`: Main application entry, sets up all subscriptions
- `src/nanostores/*`: State stores for each component
- `src/models/*`: TypeScript types and default values
- `src/views/*`: Functions that generate HTML from state
- `src/helpers/*`: Utility functions (DOM manipulation, loading states)
- `src/controller/settings.ts`: Handles settings dialog interactions
- `src/service-worker.js`: PWA offline support