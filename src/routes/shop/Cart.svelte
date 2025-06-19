<script lang="ts">
    import { navigate, currentRoute, routeParams, type RouteProps } from '../../lib';
    
    export let props: RouteProps | null = null;
    
    let currentPath = "";
    let params = {};
    
    currentRoute.subscribe(value => currentPath = value);
    routeParams.subscribe(value => params = value);
</script>

<div class="cart">
    <h2>🛒 Shopping Cart</h2>
    
    <div class="route-info">
        <p><strong>Current Path:</strong> {currentPath}</p>
        <p><strong>Params:</strong> {JSON.stringify(params)}</p>
    </div>
    
    <div class="nav-buttons">
        <button on:click={() => navigate('/shop')}>Shop Home</button>
        <button on:click={() => navigate('/shop/products')}>Continue Shopping</button>
        <button on:click={() => navigate('/')}>Main Home</button>
    </div>
</div>

<style>
    .cart {
        padding: 2rem;
        text-align: center;
    }
    
    h2 {
        margin-bottom: 1.5rem;
    }
    
    .route-info {
        background-color: #e3f2fd;
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
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 5px;
        font-weight: bold;
        cursor: pointer;
    }
    
    button:hover {
        background: #1976D2;
    }
</style>