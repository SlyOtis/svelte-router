<script>
  import { routeStore, navigateTo, goBack } from '../../lib';
  
  let productId = $derived($routeStore.params?.id);
</script>

<div class="product-detail">
  <h2>🔍 Product {productId} Details</h2>
  <div class="nav-buttons">
    <button on:click={() => navigateTo('/shop/products')}>Back to Products</button>
    <button on:click={() => navigateTo('/shop')}>Shop Home</button>
    <button on:click={() => navigateTo('/shop/cart')}>Add to Cart</button>
    <button class="back-btn" on:click={goBack}>Go Back</button>
  </div>
</div>

<style>
  .product-detail {
    padding: 2rem;
    text-align: center;
  }
  
  h2 {
    margin-bottom: 2rem;
  }
  
  .nav-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
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
</style>