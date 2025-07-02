<div class="shop-page">
  <h2>🏠 Shop Home</h2>
  <p>Welcome to our shop!</p>
  
  <div class="featured-products">
    <h3>Featured Products</h3>
    <div class="product-grid">
      <div class="product-card">
        <h4>Product 1</h4>
        <p>$29.99</p>
        <a href="/shop/products/1">View Details →</a>
      </div>
      
      <div class="product-card">
        <h4>Product 2</h4>
        <p>$39.99</p>
        <a href="/shop/products/2">View Details →</a>
      </div>
      
      <div class="product-card">
        <h4>Product 3</h4>
        <p>$19.99</p>
        <a href="/shop/products/3">View Details →</a>
      </div>
    </div>
  </div>
  
  <div class="shop-actions">
    <a href="/shop/products">View All Products</a>
    <a href="/shop/cart">View Cart</a>
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
  
  .featured-products {
    margin: 2rem 0;
  }
  
  .featured-products h3 {
    color: #4CAF50;
    margin-bottom: 1rem;
  }
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .product-card {
    background: #34495e;
    color: white;
    padding: 1rem;
    border: 1px solid #4a6378;
    border-radius: 8px;
    text-align: center;
  }
  
  .product-card h4 {
    margin: 0 0 0.5rem 0;
    color: #4CAF50;
  }
  
  .product-card p {
    font-weight: bold;
    color: #666;
    margin: 0.5rem 0;
  }
  
  .product-card a {
    color: #4CAF50;
    text-decoration: none;
    font-size: 0.9rem;
  }
  
  .product-card a:hover {
    text-decoration: underline;
  }
  
  .shop-actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .shop-actions a {
    padding: 0.75rem 1.5rem;
    background: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
  
  .shop-actions a:hover {
    background: #45a049;
  }
</style>