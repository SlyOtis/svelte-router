<div class="shop-page">
  <h2>🛍️ Products</h2>
  <p>Browse our product catalog</p>
  
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
</style>