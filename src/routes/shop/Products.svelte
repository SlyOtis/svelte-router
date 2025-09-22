<script lang="ts">
  let {route} = $props<{route?: any}>()
  
  const category = $derived(route?.search?.category || 'all')
  const sortBy = $derived(route?.search?.sort || 'name')
  const minPrice = $derived(route?.search?.minPrice || '0')
</script>

<div class="shop-page">
  <h2>🛍️ Products</h2>
  <p>Browse our product catalog</p>
  
  {#if route?.search && Object.keys(route.search).length > 0}
    <div class="search-params">
      <h4>Active Filters:</h4>
      <p>Category: {category}</p>
      <p>Sort: {sortBy}</p>
      {#if minPrice !== '0'}
        <p>Min Price: ${minPrice}</p>
      {/if}
    </div>
  {/if}
  
  <div class="products-grid">
    <div class="product-item">
      <h3>Product 1</h3>
      <p>$29.99</p>
      <a href="/shop/products/1">View Details →</a>
    </div>
    
    <div class="product-item">
      <h3>Product 2</h3>
      <p>$39.99</p>
      <a href="/shop/products/2">View Details →</a>
    </div>
    
    <div class="product-item">
      <h3>Product 3</h3>
      <p>$19.99</p>
      <a href="/shop/products/3">View Details →</a>
    </div>
  </div>
  
  <div class="actions">
    <a href="/shop">← Back to Shop</a>
  </div>
</div>

<style>
  .shop-page {
    text-align: center;
  }
  
  h2 {
    color: #4CAF50;
    margin-bottom: 1rem;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
  }
  
  .product-item {
    background: #34495e;
    color: white;
    padding: 1.5rem;
    border: 1px solid #4a6378;
    border-radius: 8px;
  }
  
  .product-item h3 {
    margin-top: 0;
    color: #4CAF50;
  }
  
  .product-item a {
    color: #4CAF50;
    text-decoration: none;
  }
  
  .actions {
    margin-top: 2rem;
  }
  
  .actions a {
    padding: 0.5rem 1rem;
    background: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
  
  .search-params {
    background: #ecf0f1;
    color: #2c3e50;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    text-align: left;
  }
  
  .search-params h4 {
    margin: 0 0 0.5rem 0;
    color: #27ae60;
  }
  
  .search-params p {
    margin: 0.25rem 0;
  }
</style>