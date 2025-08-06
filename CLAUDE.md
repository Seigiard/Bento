# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bento is a minimalist, elegant and hackable startpage inspired by the Bento box. It's a personalized new tab page built with **Preact**, **TypeScript**, **Tailwind CSS**, **DaisyUI**, and **nanostores**.

## Technology Stack
- **Framework**: Preact v10 (lightweight React alternative)
- **Build Tool**: Parcel v2
- **State Management**: nanostores + @preact/signals
- **Styling**: Tailwind CSS v4 + DaisyUI v5
- **TypeScript**: Strict mode with TSX components
- **API**: Raindrop.io with IndexedDB caching

## Architecture

1. **Entry Point**: `src/index.html` → `src/main.tsx` → `src/App.tsx`

2. **State Management**:
   - **Persistent**: nanostores with localStorage (`$settings`)
   - **Component**: @preact/signals for local reactive state
   - **Integration**: `useStore()` hook from @nanostores/preact

3. **Raindrop.io Integration**:
   - API client with Valibot validation
   - IndexedDB caching via Dexie.js
   - Offline-first architecture

## Project Structure

```
src/
├── main.tsx                     # Preact bootstrap
├── App.tsx                      # Root component
├── components/
│   └── Settings.tsx            # Settings modal
├── nanostores/
│   └── settings.ts             # Persistent settings
├── models/                     # TypeScript types
├── services/raindrop/          # Raindrop.io API
└── index.css                   # Tailwind entry point
```

## Development

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run lint    # Check code quality
```

## Important Notes

- **Styling**: Components styled with DaisyUI kit. Use context7 for DaisyUI component documentation.
- **Preact Syntax**: Use `class` instead of `className`
- **No React Icons**: Use SVG icons directly to avoid compatibility issues
- **State**: nanostores for persistence, signals for component state

## Adding Features

### New Setting
1. Update `src/models/settings.ts` interface
2. Add to `defaultSettings` and `SettingsFormFields`
3. Update Settings component UI

### New Component
1. Create `.tsx` file in `src/components/`
2. Use `useStore($settings)` for settings access
3. Use signals for local state