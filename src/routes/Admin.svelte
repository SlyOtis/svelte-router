<script lang="ts">
    import { Router, navigate } from "../lib";
    
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

<section>
    <h1>Admin Panel</h1>
    
    <div class="navigation">
        <button on:click={() => navigate("/")}>Home</button>
        <button on:click={() => navigate("/about")}>About</button>
        <button on:click={() => navigate("/user/test")}>User</button>
        <button on:click={() => navigate("/shop")}>Shop</button>
        <button on:click={() => navigate("/admin")}>Dashboard</button>
        <button on:click={() => navigate("/admin/settings")}>Settings</button>
        <button on:click={() => navigate("/admin/profile")}>Profile</button>
        <button on:click={() => navigate("/admin/users")}>Users</button>
        <button on:click={() => navigate("/admin/users/123")}>User 123</button>
    </div>
    
    <div class="content">
        <Router routes={routes} />
    </div>
</section>

<style>
    section {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 1rem;
        max-width: 800px;
        margin: 0 auto;
    }
    
    h1 {
        margin-bottom: 2rem;
    }
    
    .navigation {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }
    
    button {
        padding: 0.5rem 1rem;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    button:hover {
        background-color: #45a049;
    }
    
    .content {
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 8px;
        min-height: 200px;
        width: 100%;
    }
</style>