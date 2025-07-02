<script>
  import {navigate} from "../../lib";

</script>

<div class="settings">
  <h2>⚙️ Settings</h2>
  <div class="nav-buttons">
    <button on:click={() => navigate('/admin')}>Dashboard</button>
    <button on:click={() => navigate('/admin/users')}>Users</button>
    <button on:click={() => navigate('/admin/profile')}>Profile</button>
  </div>
</div>

<style>
  .settings {
    padding: 2rem;
    text-align: center;
  }
  
  h2 {
    margin-bottom: 2rem;
  }
  
  .nav-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  
  button {
    padding: 0.8rem 1.5rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
  }
</style>