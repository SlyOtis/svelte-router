<div class="error-page">
  <h1>404 - Page Not Found</h1>
  <p>The page you're looking for doesn't exist.</p>
  <p>This is the main fallback route that catches unmatched URLs.</p>
  
  <div class="actions">
    <a href="/">Go Home</a>
    <button on:click={() => window.history.back()}>Go Back</button>
  </div>
</div>

<style>
  .error-page {
    padding: 3rem;
    text-align: center;
    border: 2px solid #f44336;
    border-radius: 8px;
    background: #ffebee;
    color: #d32f2f;
  }
  
  h1 {
    margin-top: 0;
    color: #f44336;
  }
  
  .actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .actions a,
  .actions button {
    padding: 0.75rem 1.5rem;
    background: #f44336;
    color: white;
    text-decoration: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .actions a:hover,
  .actions button:hover {
    background: #d32f2f;
  }
</style>