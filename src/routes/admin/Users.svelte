<script lang="ts">
    import { Router, navigate } from '../../lib';
    
    const routes = {
        '/': () => import('./Users.svelte'),
        '/:id': () => import('./UserDetail.svelte')
    };

</script>

<div class="users">
    <h2>👥 Users</h2>
    
    <div class="nav-buttons">
        <button on:click={() => navigate("/admin")}>Dashboard</button>
        <button on:click={() => navigate("/admin/settings")}>Settings</button>
        <button on:click={() => navigate("/admin/profile")}>Profile</button>
        <button on:click={() => navigate("/")}>Main Home</button>
    </div>
    
    <div class="user-links">
        <button on:click={() => navigate("/admin/users/1")}>User 1</button>
        <button on:click={() => navigate("/admin/users/2")}>User 2</button>
        <button on:click={() => navigate("/admin/users/3")}>User 3</button>
    </div>
</div>

<Router routes={routes} />

<style>
    .users {
        padding: 2rem;
        text-align: center;
    }
    
    h2 {
        margin-bottom: 1.5rem;
    }
    
    .nav-buttons, .user-links {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }
    
    button {
        padding: 0.8rem 1.5rem;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        font-weight: bold;
        cursor: pointer;
    }
    
    button:hover {
        background: #388e3c;
    }
</style>