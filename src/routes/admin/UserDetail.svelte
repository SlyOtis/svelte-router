<script>
  import { routeStore, navigateTo, goBack } from '../../lib';
  
  let userId = $derived($routeStore.params?.id);
</script>

<div class="user-detail">
  <h2>👤 User {userId} Details</h2>
  <div class="nav-buttons">
    <button on:click={() => navigateTo('/admin/users')}>Back to Users</button>
    <button on:click={() => navigateTo('/admin')}>Dashboard</button>
    <button class="back-btn" on:click={goBack}>Go Back</button>
  </div>
</div>

<style>
  .user-detail {
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