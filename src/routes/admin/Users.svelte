<div class="admin-page">
  <h2>👥 Admin Users</h2>
  <p>Manage users from the admin panel</p>
  
  <div class="user-list">
    <div class="user-item">
      <span>User #123</span>
      <a href="/admin/users/123">View Details →</a>
    </div>
    <div class="user-item">
      <span>User #456</span>
      <a href="/admin/users/456">View Details →</a>
    </div>
    <div class="user-item">
      <span>User #789</span>
      <a href="/admin/users/789">View Details →</a>
    </div>
  </div>
  
  <p class="note">Click on any user to see nested routing with parameters</p>
</div>

<style>
  .admin-page {
    text-align: center;
  }
  
  h2 {
    color: #f44336;
    margin-bottom: 1rem;
  }
  
  .user-list {
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #34495e;
    color: white;
    border: 1px solid #4a6378;
    border-radius: 4px;
  }
  
  .user-item a {
    color: #f44336;
    text-decoration: none;
    font-weight: bold;
  }
  
  .user-item a:hover {
    text-decoration: underline;
  }
  
  .note {
    font-style: italic;
    color: #666;
    margin-top: 2rem;
  }
</style>