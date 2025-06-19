<script>
  import { navigateTo, goBack } from '../../lib';
</script>

<div class="products">
  <h2>📦 Products</h2>
  <div class="nav-buttons">
    <button on:click={() => navigateTo('/shop')}>Shop Home</button>
    <button on:click={() => navigateTo('/shop/cart')}>Cart</button>
    <button class="back-btn" on:click={goBack}>Go Back</button>
  </div>
  <div class="product-links">
    <button on:click={() => navigateTo('/shop/products/1')}>Product 1</button>
    <button on:click={() => navigateTo('/shop/products/2')}>Product 2</button>
    <button on:click={() => navigateTo('/shop/products/3')}>Product 3</button>
  </div>
</div>

<style>
  .products {
    padding: 2rem;
    text-align: center;
  }
  
  h2 {
    margin-bottom: 2rem;
  }
  
  .nav-buttons, .product-links {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1rem;
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