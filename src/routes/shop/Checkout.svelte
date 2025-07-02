<div class="shop-page">
  <h2>💳 Checkout</h2>
  <p>Complete your purchase</p>
  
  <div class="checkout-form">
    <h3>Order Summary</h3>
    <div class="order-item">
      <span>Product 1</span>
      <span>$29.99</span>
    </div>
    <div class="order-item">
      <span>Product 2</span>
      <span>$39.99</span>
    </div>
    <div class="order-total">
      <strong>Total: $69.98</strong>
    </div>
  </div>
  
  <div class="note">
    <p>This demonstrates route redirects. The <code>/shop/orders</code> route redirects here.</p>
  </div>
  
  <div class="actions">
    <a href="/shop/cart">← Back to Cart</a>
    <a href="/shop">Complete Order</a>
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
  
  .checkout-form {
    max-width: 400px;
    margin: 2rem auto;
    background: #34495e;
    color: white;
    padding: 2rem;
    border: 1px solid #4a6378;
    border-radius: 8px;
  }
  
  .checkout-form h3 {
    margin-top: 0;
    color: #4CAF50;
  }
  
  .order-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
  }
  
  .order-total {
    margin-top: 1rem;
    padding: 1rem;
    background: #27ae60;
    color: white;
    border-radius: 4px;
    font-size: 1.1rem;
  }
  
  .note {
    margin: 2rem 0;
    padding: 1rem;
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 4px;
    color: #856404;
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
  
  code {
    background: #2c3e50;
    color: #4CAF50;
    padding: 2px 4px;
    border-radius: 2px;
  }
</style>