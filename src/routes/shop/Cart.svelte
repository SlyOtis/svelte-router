<div class="shop-page">
  <h2>🛒 Shopping Cart</h2>
  <p>Your cart items</p>
  
  <div class="cart-items">
    <div class="cart-item">
      <span>Product 1</span>
      <span>$29.99</span>
    </div>
    <div class="cart-item">
      <span>Product 2</span>
      <span>$39.99</span>
    </div>
  </div>
  
  <div class="cart-total">
    <strong>Total: $69.98</strong>
  </div>
  
  <div class="actions">
    <a href="/shop/products">← Continue Shopping</a>
    <a href="/shop/checkout">Checkout →</a>
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
  
  .cart-items {
    margin: 2rem 0;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .cart-item {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: #34495e;
    color: white;
    border: 1px solid #4a6378;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }
  
  .cart-total {
    margin: 2rem 0;
    padding: 1rem;
    background: #27ae60;
    color: white;
    border-radius: 4px;
    font-size: 1.2rem;
  }
  
  .actions {
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
</style>