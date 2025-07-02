# sly-svelte-location-router

A lightweight and flexible router for Svelte applications with advanced nested routing capabilities, leveraging path-to-regexp for powerful route matching.

## Features

- **Nested Routing**: Full support for deeply nested router hierarchies
- **Context-based Route Resolution**: Efficient segment-by-segment route resolution
- **Fallback Propagation**: Error handling that bubbles up through router hierarchy
- **Route Redirects**: Simple string-based route redirection
- **Path Parameters**: Dynamic route parameters with full TypeScript support
- **Lazy Loading**: Automatic code-splitting with dynamic imports
- **Auto-initialization**: Routers initialize automatically when mounted
- **TypeScript First**: Complete TypeScript support with strict typing
- **Longest Path Matching**: Intelligent route sorting prioritizes longer, more specific paths

## Installation

```bash
pnpm install sly-svelte-router
```

## Basic Usage

### Automatic Initialization (Recommended)

```svelte
<script lang="ts">
  import { Router } from 'sly-svelte-router';
  import type { Routes } from 'sly-svelte-router';

  const routes: Routes = {
    '/': () => import('./routes/Home.svelte'),
    '/about': () => import('./routes/About.svelte'),
    '/users/:id': () => import('./routes/UserDetail.svelte'),
    '/legacy-path': '/about', // Redirect
  };
</script>

<Router {routes} fallback={() => import('./routes/404.svelte')}>
  <div>Loading...</div>
</Router>
```

### Manual Initialization

For more control over when the router initializes, you can call `initRouter()` manually:

```svelte
<script lang="ts">
  import { Router, initRouter } from 'sly-svelte-router';
  import { onMount } from 'svelte';
  import type { Routes } from 'sly-svelte-router';

  const routes: Routes = {
    '/': () => import('./routes/Home.svelte'),
    '/about': () => import('./routes/About.svelte'),
  };

  onMount(() => {
    // Initialize router manually after some setup
    initRouter();
  });
</script>

<Router {routes} fallback={() => import('./routes/404.svelte')}>
  <div>Loading...</div>
</Router>
```

## Nested Routing

Create complex nested route structures by using Router components within your route components:

```svelte
<!-- routes/Admin.svelte -->
<script lang="ts">
  import { Router } from 'sly-svelte-router';
  import type { Routes } from 'sly-svelte-router';
  
  const routes: Routes = {
    '/': () => import('./admin/Dashboard.svelte'),
    '/users': () => import('./admin/Users.svelte'),
    '/users/:id': () => import('./admin/UserDetail.svelte'),
    '/settings': () => import('./admin/Settings.svelte'),
  };
</script>

<div class="admin-layout">
  <nav><!-- Admin navigation --></nav>
  
  <main>
    <Router {routes} fallback={() => import('./admin/NotFound.svelte')}>
      <div>Loading admin content...</div>
    </Router>
  </main>
</div>
```

**URL Examples:**
- `/admin` → Admin layout + Dashboard
- `/admin/users` → Admin layout + Users list  
- `/admin/users/123` → Admin layout + User detail for ID 123
- `/admin/invalid` → Admin layout + Admin-specific 404 page

## Route Resolution Strategy

The router uses a sophisticated segment-by-segment resolution strategy:

1. **Longest Path First**: Routes are sorted by length and specificity
2. **Segment Consumption**: Each router consumes matching path segments  
3. **Remaining Propagation**: Unmatched segments pass to nested routers
4. **Fallback Bubbling**: Unresolved routes trigger fallbacks up the hierarchy

**Example with `/shop/products/123`:**
```
Main Router: matches '/shop' → loads Shop component, remaining: ['products', '123']
Shop Router: matches '/products/:id' → loads ProductDetail, remaining: []
```

## Route Definitions

### Function Routes (Recommended)
```typescript
'/users/:id': () => import('./routes/UserDetail.svelte')
```

### Named Routes
```typescript
'/posts/:category/:id': {
  name: 'post-detail',
  component: () => import('./routes/PostDetail.svelte')
}
```

### Redirects
```typescript
'/old-users': '/users',           // Simple redirect
'/legacy/:id': '/users/:id'       // Parameter-preserving redirect
```

## Path Parameters

Route parameters are automatically extracted and passed to components:

```svelte
<!-- UserDetail.svelte -->
<script lang="ts">
  let { props } = $props();
  let params = props?.params || {};
</script>

<h1>User: {params.id}</h1>
<p>Category: {params.category}</p>
```

**Supported Parameter Types:**
- `:id` - Required parameter
- `:id?` - Optional parameter  
- `:path*` - Zero or more segments
- `:path+` - One or more segments

## Programmatic Navigation

```typescript
import { navigate } from 'sly-svelte-router';

// Navigate to a new route
navigate('/users/123');

// Works with nested routes
navigate('/admin/users/456');
```

## Error Handling & Fallbacks

Fallbacks handle unmatched routes and can be defined at any router level:

```svelte
<!-- Main app fallback -->
<Router {routes} fallback={() => import('./routes/404.svelte')}>
  <div>Loading...</div>
</Router>

<!-- Admin-specific fallback -->
<Router {adminRoutes} fallback={() => import('./admin/NotFound.svelte')}>
  <div>Loading admin...</div>
</Router>
```

**Fallback Resolution:**
1. Child router tries to match route
2. If no match, checks for local fallback
3. If no local fallback, error propagates to parent
4. Parent router tries its fallback
5. Process continues up the hierarchy

## Advanced Examples

### E-commerce Site Structure
```
/                    → Homepage
/products           → Product list  
/products/123       → Product detail
/cart               → Shopping cart
/admin              → Admin dashboard
/admin/products     → Admin product management
/admin/orders       → Admin order management
```

### Implementation:
```svelte
<!-- App.svelte -->
<script lang="ts">
  const routes = {
    '/': () => import('./routes/Home.svelte'),
    '/products': () => import('./routes/Products.svelte'),
    '/products/:id': () => import('./routes/ProductDetail.svelte'),
    '/cart': () => import('./routes/Cart.svelte'),
    '/admin': () => import('./routes/Admin.svelte'),
  };
</script>

<Router {routes} fallback={() => import('./routes/404.svelte')}>
  <div>Loading...</div>
</Router>
```

## TypeScript Support

Full TypeScript support with strict typing:

```typescript
import type { Routes, RouteParams, RouteDefinition } from 'sly-svelte-router';

const routes: Routes = {
  '/users/:id': () => import('./UserDetail.svelte')
};

// In your component
let { props }: { props?: { params?: RouteParams } } = $props();
```

## Performance

- **Lazy Loading**: Components loaded on-demand
- **Code Splitting**: Automatic bundle splitting per route
- **Efficient Matching**: O(log n) route resolution
- **Context Sharing**: Minimal overhead for nested routers

## Migration Guide

### From Traditional Routers
- Replace single route table with nested Router components
- Move route-specific layouts into route components
- Use fallback props instead of catch-all routes

### From Hash-based Routers  
- Remove hash-based route definitions
- Use standard path-based routes
- Redirects handle legacy hash URLs if needed

## API Reference

### `Router` Component
- `routes: Routes` - Route configuration object
- `fallback?: RouteDefinition` - Fallback component for unmatched routes
- `children?` - Loading component (rendered during route transitions)

### `navigate(path: string)`
Programmatic navigation function.

### `initRouter()`
Manual router initialization function. Call this when you need precise control over when the router starts listening to navigation events. The Router component calls this automatically on mount, so manual initialization is only needed in special cases.

### Types
- `Routes` - Route configuration object type
- `RouteDefinition` - Union type for route definitions
- `RouteParams` - Route parameter object type
- `RouteComponent` - Lazy-loaded component type

## License

MIT

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.