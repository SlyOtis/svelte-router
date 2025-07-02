<script lang="ts">
  import { routeParams } from '../lib';
  
  let { props } = $props();
  let params = props?.params || {};
</script>

<div class="page">
  <h1>User Detail</h1>
  <p>This page demonstrates route parameter handling.</p>
  
  <div class="user-info">
    <h3>Route Information:</h3>
    <p><strong>User ID:</strong> {params.id || 'No ID provided'}</p>
    <p><strong>Route Pattern:</strong> <code>/users/:id</code></p>
  </div>
  
  <div class="actions">
    <a href="/users">← Back to Users List</a>
  </div>
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
  .user-info {
    margin: 2rem 0;
    padding: 1rem;
    background: #34495e;
    border-radius: 4px;
    border-left: 4px solid #9C27B0;
    color: white;
  }
  .actions {
    margin-top: 2rem;
  }
  .actions a {
    padding: 0.5rem 1rem;
    background: #9C27B0;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
  .actions a:hover {
    background: #7B1FA2;
  }
  code {
    background: #34495e;
    color: #ba68c8;
    padding: 2px 4px;
    border-radius: 2px;
  }
</style>