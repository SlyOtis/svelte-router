<script lang="ts">
    import { onMount } from "svelte";
    import { Router, navigate, currentRoute, routeParams, queryParams, routeName, type RouteProps } from "../lib";
    
    export let props: RouteProps | null = null;
    export let remainingPath = '';
    
    let route = "";
    let params = {};
    let query = new Map();
    let name = "";
    
    const routes = {
        '/': () => import('./shop/Home.svelte'),
        '/products': () => import('./shop/Products.svelte'),
        '/product/:id': () => import('./shop/ProductDetail.svelte'),
        '/cart': () => import('./shop/Cart.svelte')
    };
    
    onMount(() => {
        if (props != null) {
            console.log(props);
        }
        
        const unsubscribeRoute = currentRoute.subscribe(value => route = value);
        const unsubscribeParams = routeParams.subscribe(value => params = value);
        const unsubscribeQuery = queryParams.subscribe(value => query = value);
        const unsubscribeName = routeName.subscribe(value => name = value || "");
        
        return () => {
            unsubscribeRoute();
            unsubscribeParams();
            unsubscribeQuery();
            unsubscribeName();
        };
    });
</script>

<section>
    <h1>Shop Page</h1>
    
    <div class="router-info">
        <p><strong>Current Route:</strong> {route}</p>
        <p><strong>Route Name:</strong> {name}</p>
        <p><strong>Route Params:</strong> {JSON.stringify(params)}</p>
        <p><strong>Query Params:</strong> {JSON.stringify(Array.from(query.entries()))}</p>
    </div>
    
    <div class="navigation">
        <button on:click={() => navigate("/")}>Home</button>
        <button on:click={() => navigate("../about")}>About</button>
        <button on:click={() => navigate("../user/test")}>User</button>
        <button on:click={() => navigate("../admin")}>Admin</button>
        <button on:click={() => navigate("")}>Shop Main</button>
        <button on:click={() => navigate("products")}>Products</button>
        <button on:click={() => navigate("product/1")}>Product 1</button>
        <button on:click={() => navigate("cart")}>Cart</button>
    </div>
    
    <div class="content">
        <Router routes={routes} {remainingPath} />
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
    
    .router-info {
        background-color: #ffd3b6;
        padding: 1rem;
        border-radius: 4px;
        width: 100%;
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