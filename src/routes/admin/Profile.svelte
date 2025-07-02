<div class="admin-page">
  <h2>👤 Admin Profile</h2>
  <p>Manage your admin profile</p>
  
  <div class="profile-info">
    <div class="profile-field">
      <label>Name:</label>
      <span>Admin User</span>
    </div>
    
    <div class="profile-field">
      <label>Email:</label>
      <span>admin@example.com</span>
    </div>
    
    <div class="profile-field">
      <label>Role:</label>
      <span>Administrator</span>
    </div>
    
    <div class="profile-field">
      <label>Last Login:</label>
      <span>Today</span>
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
  
  .profile-info {
    max-width: 400px;
    margin: 2rem auto;
    background: #34495e;
    color: white;
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #4a6378;
    text-align: left;
  }
  
  .profile-field {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;
    padding: 0.5rem;
    background: #2c3e50;
    border-radius: 4px;
    color: white;
  }
  
  .profile-field label {
    font-weight: bold;
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