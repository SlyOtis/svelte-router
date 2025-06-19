<script>
  import { Router, routeStore, navigateTo, goBack } from '../../lib';
  
  export let remainingPath = '';
  
  const routes = {
    '/': () => import('./Users.svelte'),
    '/:id': () => import('./UserDetail.svelte')
  };
  
  $: showUserList = !remainingPath || remainingPath === '/' || remainingPath === '';
  $: if ($routeStore.params?.id) showUserList = false;
</script>

{#if showUserList}
<div class="users">
  <h2>👥 Users</h2>
  <div class="nav-buttons">
    <button on:click={() => navigateTo('/admin')}>Dashboard</button>
    <button on:click={() => navigateTo('/admin/settings')}>Settings</button>
    <button on:click={() => navigateTo('/admin/profile')}>Profile</button>
    <button class="back-btn" on:click={goBack}>Go Back</button>
  </div>
  <div class="user-links">
    <button on:click={() => navigateTo('/admin/users/1')}>User 1</button>
    <button on:click={() => navigateTo('/admin/users/2')}>User 2</button>
    <button on:click={() => navigateTo('/admin/users/3')}>User 3</button>
  </div>
</div>
{:else}
<Router routes={routes} {remainingPath} />
{/if}

<style>
  .users {
    padding: 2rem;
    text-align: center;
  }
  
  h2 {
    margin-bottom: 2rem;
  }
  
  .nav-buttons, .user-links {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1rem;
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