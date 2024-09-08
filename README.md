# sly-svelte-router

A SPA router for Svelte based on the History API

## Installation

```bash
npm install sly-svelte-router
```

## Usage

```svelte
<script lang="ts">
  import { Router } from 'sly-svelte-router';
  import type { Routes } from 'sly-svelte-router';

  const routes: Routes = {
    '/': () => import('./routes/Home.svelte'),
    '/about': () => import('./routes/About.svelte'),
    '/user/:id': () => import('./routes/User.svelte'),
    '*': () => import('./routes/404.svelte'),
  };

  const fallback = () => import('./routes/404.svelte');
</script>

<Router {routes} {fallback}>
  <div>Loading...</div>
</Router>
```

## Features

- Simple API
- TypeScript support
- Lazy-loading of route components
- Custom loading component
- Fallback route for 404 pages
- Supports path parameters and query parameters

## API

### `Router` component

Main component for setting up routing.

Props:
- `routes`: An object mapping route paths to component imports
- `fallback`: A function returning a Promise that imports the fallback component

### `navigate(path: string, state: any = null)`

Programmatically navigate to a new route.

### Stores

- `currentRoute`: Current route path
- `queryParams`: Map of query parameters
- `routeState`: Current route state
- `routeHash`: Current route hash
- `routeParams`: Object containing route parameters

## License

MIT
