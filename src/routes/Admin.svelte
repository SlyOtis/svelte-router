<script lang="ts">
  import Router from "../lib/Router.svelte";
  import type { Routes } from "../lib";
  
  const routes: Routes = {
    '/': () => import('./admin/Dashboard.svelte'),
    '/dashboard': () => import('./admin/Dashboard.svelte'),
    '/settings': () => import('./admin/Settings.svelte'),
    '/profile': () => import('./admin/Profile.svelte'),
    '/users': () => import('./admin/Users.svelte'),
    '/users/:id': () => import('./admin/UserDetail.svelte'),
  };
</script>

<div class="admin-layout">
  <div class="admin-header">
    <h1>Admin Panel</h1>
    <p>Nested routing demonstration</p>
  </div>
  
  <div class="admin-nav">
    <a href="/admin">Dashboard</a>
    <a href="/admin/users">Users</a>
    <a href="/admin/users/123">User 123</a>
    <a href="/admin/settings">Settings</a>
    <a href="/admin/profile">Profile</a>
  </div>
  
  <div class="admin-content">
    <Router {routes} fallback={() => import('./admin/NotFound.svelte')}>
      <div class="loading">Loading admin content...</div>
    </Router>
  </div>
</div>

<style>
  .admin-layout {
    border: 2px solid #f44336;
    border-radius: 8px;
    background: #f9f9f9;
    overflow: hidden;
  }
  
  .admin-header {
    background: #f44336;
    color: white;
    padding: 1rem;
    text-align: center;
  }
  
  .admin-header h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
  }
  
  .admin-header p {
    margin: 0;
    opacity: 0.9;
  }
  
  .admin-nav {
    background: #ffebee;
    padding: 1rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    border-bottom: 1px solid #ddd;
  }
  
  .admin-nav a {
    padding: 0.5rem 1rem;
    background: #f44336;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  
  .admin-nav a:hover {
    background: #d32f2f;
  }
  
  .admin-content {
    padding: 2rem;
    min-height: 200px;
  }
  
  .loading {
    color: #666;
    font-style: italic;
    text-align: center;
    padding: 2rem;
  }
</style>