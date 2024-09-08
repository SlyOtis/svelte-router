<script lang="ts">
  import Router from './lib/Router.svelte';
  import type { Routes } from './lib';

  const routes: Routes = {
    '/': () => import('./routes/Home.svelte'),
    '/about/:id': () => import('./routes/About.svelte'),
    '*': () => import('./routes/404.svelte'),
  };

  const fallback = () => import('./routes/404.svelte');
</script>

<Router {routes} {fallback}>
  <div>Custom loading component...</div>
</Router>