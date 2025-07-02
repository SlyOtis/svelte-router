<script lang="ts">
  import Router from "../lib/Router.svelte";
  import type { Routes } from "../lib";
  
  const routes: Routes = {
    '/': () => import('./shop/Home.svelte'),
    '/products': () => import('./shop/Products.svelte'),
    '/products/:id': () => import('./shop/ProductDetail.svelte'),
    '/cart': () => import('./shop/Cart.svelte'),
    '/checkout': () => import('./shop/Checkout.svelte'),
    '/orders': '/checkout',
  };
</script>

<div class="shop-layout">
  <div class="shop-header">
    <h1>Shop</h1>
    <p>E-commerce nested routing demonstration</p>
  </div>
  
  <div class="shop-nav">
    <a href="/shop">Home</a>
    <a href="/shop/products">Products</a>
    <a href="/shop/products/123">Product 123</a>
    <a href="/shop/cart">Cart</a>
    <a href="/shop/checkout">Checkout</a>
    <a href="/shop/orders">Orders (redirect)</a>
  </div>
  
  <div class="shop-content">
    <Router {routes} fallback={() => import('./shop/NotFound.svelte')}>
      <div class="loading">Loading shop content...</div>
    </Router>
  </div>
</div>

<style>
  .shop-layout {
    border: 2px solid #4CAF50;
    border-radius: 8px;
    background: #f9f9f9;
    overflow: hidden;
  }
  
  .shop-header {
    background: #4CAF50;
    color: white;
    padding: 1rem;
    text-align: center;
  }
  
  .shop-header h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
  }
  
  .shop-header p {
    margin: 0;
    opacity: 0.9;
  }
  
  .shop-nav {
    background: #e8f5e8;
    padding: 1rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    border-bottom: 1px solid #ddd;
  }
  
  .shop-nav a {
    padding: 0.5rem 1rem;
    background: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  
  .shop-nav a:hover {
    background: #45a049;
  }
  
  .shop-content {
    padding: 2rem;
    min-height: 200px;
  }
  
  .loading {
    color: #666;
    font-style: italic;
    text-align: center;
    padding: 2rem;
  }
</style>