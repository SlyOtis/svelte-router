<div class="admin-page">
  <h2>⚙️ Admin Settings</h2>
  <p>Configure system settings</p>
  
  <div class="settings-sections">
    <div class="setting-section">
      <h3>General Settings</h3>
      <p>Basic system configuration</p>
    </div>
    
    <div class="setting-section">
      <h3>User Management</h3>
      <p>User-related settings</p>
    </div>
    
    <div class="setting-section">
      <h3>Security</h3>
      <p>Security and authentication settings</p>
    </div>
  </div>
  
  <div class="actions">
    <a href="/admin">← Back to Dashboard</a>
  </div>
</div>

<style>
  .admin-page {
    text-align: center;
  }
  
  h2 {
    color: #f44336;
    margin-bottom: 1rem;
  }
  
  .settings-sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
  }
  
  .setting-section {
    background: #34495e;
    color: white;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #4a6378;
    text-align: left;
  }
  
  .setting-section h3 {
    margin-top: 0;
    color: #f44336;
  }
  
  .actions {
    margin-top: 2rem;
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