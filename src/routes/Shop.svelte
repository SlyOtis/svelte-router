<script lang="ts">
    import { Router, navigate } from "../lib";
    
    const routes = {
        '/': () => import('./shop/Home.svelte'),
        '/products': () => import('./shop/Products.svelte'),
        '/product/:id': () => import('./shop/ProductDetail.svelte'),
        '/cart': () => import('./shop/Cart.svelte')
    };
</script>

<section>
    <h1>Shop Page</h1>
    
    <div class="navigation">
        <button on:click={() => navigate("/")}>Home</button>
        <button on:click={() => navigate("/about")}>About</button>
        <button on:click={() => navigate("/user/test")}>User</button>
        <button on:click={() => navigate("/admin")}>Admin</button>
        <button on:click={() => navigate("/shop")}>Shop Main</button>
        <button on:click={() => navigate("/shop/products")}>Products</button>
        <button on:click={() => navigate("/shop/product/1")}>Product 1</button>
        <button on:click={() => navigate("/shop/cart")}>Cart</button>
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