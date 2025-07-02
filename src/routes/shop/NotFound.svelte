<div class="shop-404">
  <h2>🛍️ Shop Page Not Found</h2>
  <p>The shop page you're looking for doesn't exist.</p>
  <p>This is the shop section's fallback component.</p>
  
  <div class="actions">
    <a href="/shop">← Back to Shop</a>
    <a href="/">← Back to Home</a>
  </div>
</div>

<style>
  .shop-404 {
    text-align: center;
    padding: 2rem;
    border: 2px dashed #4CAF50;
    border-radius: 8px;
    background: #f1f8e9;
  }
  
  h2 {
    color: #4CAF50;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 0.5rem;
  }
  
  .actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .actions a {
    padding: 0.5rem 1rem;
    background: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
  
  .actions a:hover {
    background: #45a049;
  }
</style>