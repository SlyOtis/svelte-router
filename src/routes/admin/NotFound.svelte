<div class="admin-404">
  <h2>⚠️ Admin Page Not Found</h2>
  <p>The admin page you're looking for doesn't exist.</p>
  <p>This is the admin section's fallback component.</p>
  
  <div class="actions">
    <a href="/admin">← Back to Dashboard</a>
    <a href="/">← Back to Home</a>
  </div>
</div>

<style>
  .admin-404 {
    text-align: center;
    padding: 2rem;
    border: 2px dashed #f44336;
    border-radius: 8px;
    background: #fff5f5;
  }
  
  h2 {
    color: #f44336;
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
    background: #f44336;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
  
  .actions a:hover {
    background: #d32f2f;
  }
</style>