# sly-svelte-location-router

A lightweight and flexible router for Svelte applications, leveraging the power of the Location API and path-to-regexp for advanced routing capabilities.

## Features

- Simple and intuitive API
- TypeScript support for enhanced developer experience
- Lazy-loading of route components for optimized performance
- Custom loading component support
- Fallback route handling for 404 pages
- Robust path matching using path-to-regexp
- Support for path parameters and query parameters
- Programmatic navigation
- Automatic route sorting for optimal matching

## Installation

```bash
pnpm install sly-svelte-router
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
    '/posts/:category/:postId': {
      name: "posts",
      component: () => import('./routes/Post.svelte')
    },
    '/redirect': '/about',
    '*': () => import('./routes/404.svelte'),
  };

  const fallback = () => import('./routes/404.svelte');
</script>

<Router {routes} {fallback}>
  <div>Loading...</div>
</Router>
```

## Route Definitions

sly-svelte-router supports three types of route definitions:

1. `RouteComponent`: A function returning a Promise that resolves to a component.
   Example: `() => import('./routes/Home.svelte')`

2. `RouteData`: An object with 'name' and 'component' properties.
   Example: `{ name: "posts", component: () => import('./routes/Post.svelte') }`

3. `string`: A pathname string for redirection.
   Example: `'/about'`

Routes are automatically sorted for optimal matching based on specificity and complexity.

## Path Matching

sly-svelte-router uses [path-to-regexp](https://github.com/pillarjs/path-to-regexp) for powerful and flexible route matching. This allows for:

- **Named Parameters**: `/user/:id` matches `/user/123` and passes `{id: '123'}` as a parameter.
- **Optional Parameters**: `/post/:id?` matches both `/post/123` and `/post`.
- **Zero or more**: `/files/*` matches any number of segments after `/files/`.
- **One or more**: `/files/:path+` requires at least one segment after `/files/`.
- **Custom matching**: Use regular expressions for fine-grained control.

Examples:
- `/user/:id` matches `/user/123`
- `/post/:category/:title?` matches `/post/tech` and `/post/tech/new-article`
- `/files/:path*` matches `/files`, `/files/document.pdf`, `/files/images/photo.jpg`

## Route Redirection

You can easily set up route redirections by specifying the target path as a string:

```typescript
const routes: Routes = {
  '/old-path': '/new-path',
  '/legacy-user/:id': '/user/:id',  // Redirects with parameters
  '/outdated': '/about',
};
```

## API

### `Router` Component

The main component for setting up routing.

Props:
- `routes`: An object mapping route paths to component imports or route definitions
- `fallback`: A function returning a Promise that imports the fallback component

### Navigation

Use the `navigate` function for programmatic navigation:

```typescript
import { navigate } from 'sly-svelte-router';

navigate('/user/123', { someState: 'value' });
```

### Stores

Access route information reactively:

```typescript
import { currentRoute, queryParams, routeState, routeHash, routeParams } from 'sly-svelte-router';

$: console.log($currentRoute); // Current route path
$: console.log($queryParams); // Map of query parameters
$: console.log($routeState); // Current route state
$: console.log($routeHash); // Current route hash
$: console.log($routeParams); // Object containing route parameters
```

## TypeScript Support

sly-svelte-router is written in TypeScript and provides type definitions out of the box for an enhanced development experience.

## Performance

Route components are lazy-loaded by default, ensuring that only the necessary code is loaded for each route, optimizing your application's performance.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
