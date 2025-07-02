<script lang="ts">
  import Router from './lib/Router.svelte';
  import type { Routes } from './lib';

  const routes: Routes = {
    '/': () => import('./routes/Home.svelte'),
    '/about': () => import('./routes/About.svelte'),
    '/contact': () => import('./routes/Contact.svelte'),
    '/users': () => import('./routes/Users.svelte'),
    '/users/:id': () => import('./routes/UserDetail.svelte'),
    '/admin': () => import('./routes/Admin.svelte'),
    '/shop': () => import('./routes/Shop.svelte'),
    '/legacy': '/about',
    '/old-contact': '/contact',
  };
</script>

<div class="app">
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
    <a href="/users">Users</a>
    <a href="/users/123">User 123</a>
    <a href="/admin">Admin</a>
    <a href="/admin/dashboard">Admin Dashboard</a>
    <a href="/admin/users">Admin Users</a>
    <a href="/shop">Shop</a>
    <a href="/shop/products">Shop Products</a>
    <a href="/shop/cart">Shop Cart</a>
    <a href="/legacy">Legacy (redirects to about)</a>
    <a href="/old-contact">Old Contact (redirects to contact)</a>
    <a href="/nonexistent">404 Test</a>
  </nav>

  <main>
    <Router {routes} fallback={() => import('./routes/404.svelte')}>
      <div class="loading">Loading...</div>
    </Router>
  </main>
</div>

<style>
  .app {
    font-family: Arial, sans-serif;
  }

  nav {
    background: #2c3e50;
    padding: 1rem;
    margin-bottom: 2rem;
  }

  nav a {
    margin-right: 1rem;
    padding: 0.75rem 1rem;
    text-decoration: none;
    color: white;
    background: #34495e;
    border: 1px solid #4a6378;
    border-radius: 4px;
    display: inline-block;
    font-weight: 500;
  }

  nav a:hover {
    background: #4a6378;
    border-color: #5a7490;
  }

  main {
    padding: 1rem;
  }

  .loading {
    color: #666;
    font-style: italic;
  }
</style>