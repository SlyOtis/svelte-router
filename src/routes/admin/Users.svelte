<script lang="ts">
    import { Router, routeStore, navigate, currentRoute, routeParams, type RouteProps } from '../../lib';
    
    export let props: RouteProps | null = null;
    export let remainingPath = '';
    
    const routes = {
        '/': () => import('./Users.svelte'),
        '/:id': () => import('./UserDetail.svelte')
    };
    
    let currentPath = "";
    let params = {};
    
    currentRoute.subscribe(value => currentPath = value);
    routeParams.subscribe(value => params = value);
    
    $: showUserList = !remainingPath || remainingPath === '/' || remainingPath === '';
    $: if ($routeStore.params?.id) showUserList = false;
</script>

{#if showUserList}
<div class="users">
    <h2>👥 Users</h2>
    
    <div class="route-info">
        <p><strong>Current Path:</strong> {currentPath}</p>
        <p><strong>Params:</strong> {JSON.stringify(params)}</p>
    </div>
    
    <div class="nav-buttons">
        <button on:click={() => navigate("../")}>Dashboard</button>
        <button on:click={() => navigate("../settings")}>Settings</button>
        <button on:click={() => navigate("../profile")}>Profile</button>
        <button on:click={() => navigate("/")}>Main Home</button>
    </div>
    
    <div class="user-links">
        <button on:click={() => navigate("1")}>User 1</button>
        <button on:click={() => navigate("2")}>User 2</button>
        <button on:click={() => navigate("3")}>User 3</button>
    </div>
</div>
{:else}
<Router routes={routes} {remainingPath} />
{/if}

<style>
    .users {
        padding: 2rem;
        text-align: center;
    }
    
    h2 {
        margin-bottom: 1.5rem;
    }
    
    .route-info {
        background-color: #c8e6c9;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1.5rem;
        text-align: left;
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