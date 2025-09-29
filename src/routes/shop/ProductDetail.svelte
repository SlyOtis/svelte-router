<script lang="ts">
  let { route } = $props();
  let params = route?.params || {};
</script>

<div class="shop-page">
  <h2>📦 Product Detail</h2>
  <p>Detailed view of product with nested routing</p>
  
  <div class="product-detail">
    <h3>Product Information</h3>
    <div class="detail-item">
      <strong>Product ID:</strong> {params.id || 'No ID provided'}
    </div>
    <div class="detail-item">
      <strong>Route Pattern:</strong> <code>/shop/products/:id</code>
    </div>
    <div class="detail-item">
      <strong>Price:</strong> $29.99
    </div>
    <div class="detail-item">
      <strong>Description:</strong> This is a great product!
    </div>
  </div>
  
  <div class="actions">
    <a href="/shop/products">← Back to Products</a>
    <a href="/shop/cart">Add to Cart</a>
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
  
  .product-detail {
    margin: 2rem 0;
    padding: 1.5rem;
    background: #34495e;
    color: white;
    border: 1px solid #4a6378;
    border-radius: 8px;
    text-align: left;
  }
  
  .product-detail h3 {
    margin-top: 0;
    color: #4CAF50;
    text-align: center;
  }
  
  .detail-item {
    margin: 1rem 0;
    padding: 0.5rem;
    background: #2c3e50;
    border-radius: 4px;
    color: white;
  }
  
  .actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .actions a {
    padding: 0.75rem 1.5rem;
    background: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
  
  .actions a:hover {
    background: #45a049;
  }
  
  code {
    background: #2c3e50;
    color: #4CAF50;
    padding: 2px 4px;
    border-radius: 2px;
  }
</style>