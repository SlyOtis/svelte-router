<script lang="ts">
  let { props } = $props();
  let params = props?.params || {};
</script>

<div class="admin-page">
  <h2>👤 Admin User Detail</h2>
  <p>Viewing user from admin panel with nested routing</p>
  
  <div class="user-detail">
    <h3>User Information</h3>
    <div class="detail-item">
      <strong>User ID:</strong> {params.id || 'No ID provided'}
    </div>
    <div class="detail-item">
      <strong>Route Pattern:</strong> <code>/admin/users/:id</code>
    </div>
    <div class="detail-item">
      <strong>Context:</strong> Admin Panel
    </div>
  </div>
  
  <div class="actions">
    <a href="/admin/users">← Back to Users</a>
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
  
  .user-detail {
    margin: 2rem 0;
    padding: 1.5rem;
    background: #34495e;
    color: white;
    border: 1px solid #4a6378;
    border-radius: 8px;
    text-align: left;
  }
  
  .user-detail h3 {
    margin-top: 0;
    color: #f44336;
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
    padding: 0.5rem 1rem;
    background: #f44336;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
  
  .actions a:hover {
    background: #d32f2f;
  }
  
  code {
    background: #2c3e50;
    color: #e74c3c;
    padding: 2px 4px;
    border-radius: 2px;
  }
</style>