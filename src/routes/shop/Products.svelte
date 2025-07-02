<script lang="ts">
    import { navigate } from '../../lib';
</script>

<div class="products">
    <h2>📦 Products</h2>
    
    <div class="nav-buttons">
        <button on:click={() => navigate("/shop")}>Shop Home</button>
        <button on:click={() => navigate("/shop/cart")}>Cart</button>
        <button on:click={() => navigate("/")}>Main Home</button>
    </div>
    
    <div class="product-links">
        <button on:click={() => navigate("/shop/product/1")}>Product 1</button>
        <button on:click={() => navigate("/shop/product/2")}>Product 2</button>
        <button on:click={() => navigate("/shop/product/3")}>Product 3</button>
    </div>
</div>

<style>
    .products {
        padding: 2rem;
        text-align: center;
    }
    
    h2 {
        margin-bottom: 1.5rem;
    }
    
    .nav-buttons, .product-links {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 1rem;
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