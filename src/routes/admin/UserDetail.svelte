<script lang="ts">
    import { routeStore, navigate, currentRoute, routeParams, type RouteProps } from '../../lib';
    
    export let props: RouteProps | null = null;
    
    let currentPath = "";
    let params = {};
    
    currentRoute.subscribe(value => currentPath = value);
    routeParams.subscribe(value => params = value);
    
    let userId = $derived($routeStore.params?.id);
</script>

<div class="user-detail">
    <h2>👤 User {userId} Details</h2>
    
    <div class="route-info">
        <p><strong>Current Path:</strong> {currentPath}</p>
        <p><strong>Params:</strong> {JSON.stringify(params)}</p>
        <p><strong>User ID:</strong> {userId}</p>
    </div>
    
    <div class="nav-buttons">
        <button on:click={() => navigate("..")}>Back to Users</button>
        <button on:click={() => navigate("../../")}>Dashboard</button>
        <button on:click={() => navigate("/")}>Main Home</button>
    </div>
</div>

<style>
    .user-detail {
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
    
    .nav-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
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