# Pokédex Field Guide

A premium editorial field guide for discovering and studying Pokémon, inspired by natural history archives and collector catalogues.

## Features

- **Search & Discovery**: Real-time search by name, type, or Pokédex number across 1,351 species
- **Type Filtering**: Filter by any of the 18 Pokémon types with elegant field-guide tabs
- **Detailed Specimen Cards**: Premium collectible-style cards with artwork, type badges, and key stats
- **Field Record Details**: Comprehensive modal with height, weight, abilities, base stats, and combat moves
- **Responsive Design**: Optimized for desktop (4-column), tablet (2-3 column), and mobile (1-2 column) layouts
- **Premium Interactions**: Subtle hover states, smooth transitions, and refined micro-interactions

## Design Philosophy

The interface is designed to feel like a thoughtfully crafted real-world product—a living field guide that balances editorial elegance with functional clarity. Every element serves a purpose: typography establishes hierarchy, spacing guides the eye, and interactions provide clear feedback without distraction.

## Tech Stack

- **Next.js 16** (App Router) - React framework with server components
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS with custom design tokens
- **PokéAPI** - Comprehensive Pokémon data source
- **Lucide React** - Clean, consistent iconography

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the field guide.

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and design tokens
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Entry point
├── components/
│   └── pokemon/
│       ├── explorer.tsx     # Main UI components and logic
│       └── pokeapi.ts       # API integration layer
└── lib/
    └── utils.ts             # Utility functions
```

## Data Source

All Pokémon data is fetched from [PokéAPI](https://pokeapi.co/), a free open API for Pokémon data.
