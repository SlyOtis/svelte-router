<div class="admin-page">
  <h2>📊 Admin Dashboard</h2>
  <p>Welcome to the admin dashboard!</p>
  <p>This demonstrates nested routing within the admin section.</p>
  
  <div class="dashboard-grid">
    <div class="card">
      <h3>Users</h3>
      <p>Manage user accounts</p>
      <a href="/admin/users">View Users →</a>
    </div>
    
    <div class="card">
      <h3>Settings</h3>
      <p>Configure system settings</p>
      <a href="/admin/settings">View Settings →</a>
    </div>
    
    <div class="card">
      <h3>Profile</h3>
      <p>Manage your profile</p>
      <a href="/admin/profile">View Profile →</a>
    </div>
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
  
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .card {
    background: #34495e;
    color: white;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #4a6378;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  .card h3 {
    margin-top: 0;
    color: #f44336;
  }
  
  .card a {
    color: #f44336;
    text-decoration: none;
    font-weight: bold;
  }
  
  .card a:hover {
    text-decoration: underline;
  }
</style>