<div class="page">
  <h1>Users List</h1>
  <p>This page shows a list of users and demonstrates basic routing.</p>
  
  <div class="users-list">
    <h3>Available Users:</h3>
    <div class="user-links">
      <a href="/users/123">User 123</a>
      <a href="/users/456">User 456</a>
      <a href="/users/789">User 789</a>
      <a href="/users/abc">User ABC</a>
    </div>
  </div>
  
  <p class="note">Click on any user to see the dynamic route parameter handling.</p>
</div>

<style>
  .page {
    padding: 2rem;
    border: 2px solid #9C27B0;
    border-radius: 8px;
    background: #2c3e50;
    color: white;
  }
  h1 {
    color: #9C27B0;
    margin-top: 0;
  }
  .users-list {
    margin: 2rem 0;
    padding: 1rem;
    background: #34495e;
    border-radius: 4px;
    color: white;
  }
  .user-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .user-links a {
    padding: 0.5rem;
    background: #9C27B0;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    display: inline-block;
    width: fit-content;
  }
  .user-links a:hover {
    background: #7B1FA2;
  }
  .note {
    font-style: italic;
    color: #bdc3c7;
  }
</style>