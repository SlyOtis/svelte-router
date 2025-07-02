<script lang="ts">
    import { navigate } from '../../lib';
</script>

<div class="shop-home">
    <h2>🏠 Shop Home</h2>
    
    <div class="nav-buttons">
        <button on:click={() => navigate("/shop/products")}>View Products</button>
        <button on:click={() => navigate("/shop/product/1")}>Product 1</button>
        <button on:click={() => navigate("/shop/cart")}>Go to Cart</button>
        <button on:click={() => navigate("/")}>Main Home</button>
    </div>
</div>

<style>
    .shop-home {
        padding: 2rem;
        text-align: center;
    }
    
    h2 {
        margin-bottom: 1.5rem;
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