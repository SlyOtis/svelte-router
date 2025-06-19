<script>
  import { navigateTo, goBack } from '../../lib';
</script>

<div class="shop-home">
  <h2>🏠 Shop Home</h2>
  <div class="nav-buttons">
    <button on:click={() => navigateTo('/shop/products')}>View Products</button>
    <button on:click={() => navigateTo('/shop/cart')}>Go to Cart</button>
    <button class="back-btn" on:click={goBack}>Go Back</button>
  </div>
</div>

<style>
  .shop-home {
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