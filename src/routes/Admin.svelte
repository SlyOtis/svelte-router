<script>
  import { Router, handleNavClick, goBack } from '../lib';
  
  export let remainingPath = '';
  
  const routes = {
    '/': () => import('./admin/Dashboard.svelte'),
    '/settings': () => import('./admin/Settings.svelte'),
    '/profile': () => import('./admin/Profile.svelte'),
    '/users/*': () => import('./admin/Users.svelte'),
    '/orders': '/admin/settings', // Placeholder redirects for now
    '/revenue': '/admin/settings',
    '/products': '/admin/settings'
  };
</script>

<div class="admin">
  <h1>Admin Panel</h1>
  
  <div class="nav" on:click={handleNavClick}>
    <a href="/">Home</a>
    <a href="/admin">Dashboard</a>
    <a href="/admin/settings">Settings</a>
    <a href="/admin/profile">Profile</a>
    <a href="/admin/users">Users</a>
    <button class="back-btn" on:click={goBack}>← Go Back</button>
  </div>
  
  <div class="content">
    <Router routes={routes} {remainingPath} />
  </div>
</div>

<style>
  .admin {
    padding: 1rem;
    text-align: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h1 {
    margin-bottom: 1rem;
  }
  
  .nav {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  a {
    background: #4CAF50;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    text-decoration: none;
  }
  
  .back-btn {
    background: #f44336;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .content {
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
    min-height: 200px;
  }
</style>