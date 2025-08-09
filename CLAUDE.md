# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bento is a minimalist, elegant and hackable startpage inspired by the Bento box. It's a personalized new tab page built with **Preact**, **TypeScript**, **Tailwind CSS**, **DaisyUI**, and **nanostores**.

## Technology Stack
- **Framework**: Preact v10 (lightweight React alternative)
- **Build Tool**: Parcel v2
- **State Management**: nanostores + @nanostores/query
- **Styling**: Tailwind CSS v4 + DaisyUI v5
- **TypeScript**: Strict mode with TSX components
- **API**: Raindrop.io via nanoquery with Valibot validation

## MCP Context7 Usage

When working with this codebase, use MCP Context7 to get up-to-date documentation for:
- **Tailwind CSS v4**: Latest utility classes and configuration
- **DaisyUI v5**: Component classes and theming
- **nanostores**: State management patterns and APIs
- **@nanostores/query**: Data fetching and caching patterns

## Architecture

1. **Entry Point**: `src/index.html` → `src/main.tsx` → `src/App.tsx`

2. **State Management**:
   - **Persistent**: nanostores with localStorage (`$settings`, `$openCategories`)
   - **API Data**: @nanostores/query for fetching and caching
   - **Integration**: `useStore()` hook from @nanostores/preact

3. **Raindrop.io Integration**:
   - **Fetching**: nanoquery with automatic caching and error handling
   - **Validation**: Valibot schemas for type-safe API responses
   - **Error Handling**: Comprehensive error states in UI

## Project Structure

```
src/
├── main.tsx                     # Preact bootstrap
├── App.tsx                      # Root component with error handling
├── components/
│   ├── Settings.tsx            # Settings modal
│   ├── Category.tsx            # Individual category with expand/collapse
│   ├── NestedCategories.tsx    # Recursive nested categories
│   ├── CategoryLinks.tsx       # Raindrop links for category
│   └── Link.tsx                # Individual raindrop link
├── nanostores/
│   ├── settings.ts             # Persistent user settings
│   ├── category-state.ts       # Category open/closed state
│   └── collections.ts          # Hierarchical collections with sorting
├── nanoquery/
│   └── raindrop-fetcher.ts     # API fetching with nanoquery
├── models/                     # TypeScript types and settings
├── services/raindrop/
│   ├── raindrop-schemas.ts     # Valibot validation schemas
│   └── openapi.yaml            # API documentation
└── index.css                   # Tailwind entry point
```

## Development

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run lint    # Check code quality
```

## Important Notes

- **Tailwind CSS v4**: We use Tailwind CSS version 4 with its new features and syntax
- **DaisyUI v5**: Component library built on top of Tailwind CSS v4
- **nanostores**: Lightweight state management solution for all application state
- **Styling**: Components styled with DaisyUI kit. Use MCP Context7 for DaisyUI component documentation
- **Preact Syntax**: Use `class` instead of `className`
- **No React Icons**: Use SVG icons directly to avoid compatibility issues
- **State**: nanostores for all state management
- **API Data**: Use nanoquery stores, not direct API calls
- **Error Handling**: All API calls have loading/error/data states

## Adding Features

### New Setting
1. Update `src/models/settings.ts` interface
2. Add to `defaultSettings` and `SettingsFormFields`
3. Update Settings component UI

### New API Endpoint
1. Add schema validation in `raindrop-schemas.ts`
2. Create store in `raindrop-fetcher.ts` using `createRaindropApiFetcherStore`
3. Use with `useStore()` in components

### New Component
1. Create `.tsx` file in `src/components/`
2. Use `useStore()` for nanostores access
3. Handle loading/error/data states properly

## Data Flow

```
API → nanoquery → Valibot validation → nanostores → Components
```

### Category Hierarchy
1. **Fetch**: `$userData`, `$rootCategories`, `$childCategories`
2. **Process**: `$collections` builds hierarchy with sorting
3. **Display**: `Category` → `NestedCategories` → recursive structure

### Error Handling Pattern
```typescript
const { loading, data, error } = useStore($someStore)

if (loading) return <Loader />
if (error) return <ErrorAlert error={error} />
if (!data) return <EmptyState />

// Render data
```