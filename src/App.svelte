<script lang="ts">
  import Router from './lib/Router.svelte';
  import type { Routes } from './lib';

  const routes: Routes = {
    '/': () => import('./routes/Home.svelte'),
    '/admin': () => import('./routes/Admin.svelte'),
    '/about': () => import('./routes/About.svelte'),
    '/user/:id': "/about",
    '/404': () => import('./routes/404.svelte'),
  };

</script>

<Router {routes}>
  <div>Custom loading component...</div>
</Router>