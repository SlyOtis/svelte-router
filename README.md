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
pnpm install sly-svelte-location-router
```

## Basic Usage

### Automatic Initialization (Recommended)

```svelte
<script lang="ts">
  import { Router } from 'sly-svelte-location-router';
  import type { Routes } from 'sly-svelte-location-router';

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

For advanced use cases where you need precise control over router initialization, you can use `initRouter()` instead of the Router component:

```svelte
<script lang="ts">
  import { initRouter, navigate } from 'sly-svelte-location-router';
  import { onMount } from 'svelte';

  onMount(() => {
    // Initialize router manually - handles URL changes and navigation
    initRouter();
    
    // You'll need to implement your own route resolution logic
    // This approach is for advanced users who want full control
  });
</script>

<!-- Custom routing implementation -->
<div>Your custom route rendering logic here</div>
```

## Nested Routing

Create complex nested route structures by using Router components within your route components:

```svelte
<!-- routes/Admin.svelte -->
<script lang="ts">
  import { Router } from 'sly-svelte-location-router';
  import type { Routes } from 'sly-svelte-location-router';
  
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

### Route Guards

Protect routes with async guard functions:

```typescript
'/admin': {
  name: 'admin',
  component: () => import('./routes/Admin.svelte'),
  guard: async () => {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      // Redirect with state
      return {
        path: '/login',
        state: { message: 'Please login to access admin area' }
      };
    }
    return null; // Allow access
  }
}
```

## Route Props

All route components receive a standardized `route` prop containing route information. The examples use Svelte 5's rune syntax (`$props()`, `$derived`) for modern, reactive component development:

```typescript
interface RouteProps {
  params?: RouteParams      // Route parameters from URL
  error?: ErroneousRouteStore  // Error info for fallback components  
  state?: any              // Navigation state data
  search?: { [key: string]: string }  // Query parameters from URL search string (only for final route)
}
```

### Accessing Route Parameters

```svelte
<!-- UserDetail.svelte -->
<script lang="ts">
  import type { RouteProps } from 'sly-svelte-location-router';
  
  let { route }: { route: RouteProps } = $props();
  
  // For /users/123, route.params.id === '123'
  const userId = $derived(route.params?.id);
</script>

<h1>User: {userId}</h1>
```

**Supported Parameter Types:**
- `:id` - Required parameter
- `:id?` - Optional parameter  
- `:path*` - Zero or more segments
- `:path+` - One or more segments

### Navigation State

Access state passed during navigation or from guards:

```svelte
<script lang="ts">
  import type { RouteProps } from 'sly-svelte-location-router';
  
  let { route }: { route: RouteProps } = $props();
  
  // Access state from guard redirects
  const message = $derived(route.state?.message);
</script>

{#if message}
  <div class="alert">{message}</div>
{/if}
```

### Query Parameters

Access URL query parameters in the final route component:

```svelte
<script lang="ts">
  import type { RouteProps } from 'sly-svelte-location-router';
  
  let { route }: { route: RouteProps } = $props();
  
  // For /products?category=electronics&sort=price
  // route.search = { category: 'electronics', sort: 'price' }
  const category = $derived(route.search?.category);
  const sortBy = $derived(route.search?.sort);
</script>

<h1>Products</h1>
{#if category}
  <p>Filtered by: {category}</p>
{/if}
```

**Note:** Query parameters are only available in the final route component, not in intermediate nested routers.

### Error Handling in Fallback Components

Fallback components receive error information through the same interface:

```svelte
<!-- 404.svelte -->
<script lang="ts">
  import type { RouteProps } from 'sly-svelte-location-router';
  
  let { route }: { route: RouteProps } = $props();
  
  const errorPath = $derived(route.error?.path);
</script>

<h1>404 - Not Found</h1>
<p>The path "{errorPath}" could not be found.</p>
```

## Programmatic Navigation

```typescript
import { navigate } from 'sly-svelte-location-router';

// Navigate to a new route
navigate('/users/123');

// Navigate with state
navigate('/dashboard', { from: 'login', userId: 123 });

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
import type { Routes, RouteProps, RouteDefinition } from 'sly-svelte-location-router';

const routes: Routes = {
  '/users/:id': () => import('./UserDetail.svelte')
};

// In your component (Svelte 5)
let { route }: { route: RouteProps } = $props();

// Type-safe access to params
const userId = $derived(route.params?.id);
```

## API Reference

### `Router` Component
- `routes: Routes` - Route configuration object
- `fallback?: RouteDefinition` - Fallback component for unmatched routes
- `children?` - Loading component (rendered during route transitions)

### `navigate(path: string, state?: any)`
Programmatic navigation function with optional state.

### `initRouter()`
Manual router initialization function. Use this instead of the Router component when you need to implement custom route resolution logic. This function sets up URL change listening and navigation event handling, but you'll need to implement your own route matching and component rendering.

### `currentRoute`
Svelte store containing the current route information. Contains `path`, `params`, and `parentPath` for reactive route tracking.

### Types
- `Routes` - Route configuration object type
- `RouteDefinition` - Union type for route definitions
- `RouteProps` - Props interface for route components
- `RouteParams` - Route parameter object type
- `RouteComponent` - Lazy-loaded component type
- `RouteGuard` - Guard function type for route protection

## License

MIT

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.