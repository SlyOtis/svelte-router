<script lang="ts">
    import { navigate } from '../../lib';
    
    let {props} = $props()
    
    let productId = $derived(params?.id);
</script>

<div class="product-detail">
    <h2>🔍 Product {productId} Details</h2>
    
    <div class="nav-buttons">
        <button on:click={() => navigate("/shop/products")}>Back to Products</button>
        <button on:click={() => navigate("/shop")}>Shop Home</button>
        <button on:click={() => navigate("/shop/cart")}>Add to Cart</button>
        <button on:click={() => navigate("/")}>Main Home</button>
    </div>
</div>

<style>
    .product-detail {
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