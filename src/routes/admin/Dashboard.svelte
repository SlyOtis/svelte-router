<script lang="ts">
    import { navigate } from '../../lib';
</script>

<div class="dashboard">
    <h2>📊 Dashboard</h2>
    
    <div class="nav-buttons">
        <button on:click={() => navigate("/admin/users")}>Users</button>
        <button on:click={() => navigate("/admin/settings")}>Settings</button>
        <button on:click={() => navigate("/admin/profile")}>Profile</button>
        <button on:click={() => navigate("/")}>Main Home</button>
    </div>
</div>

<style>
    .dashboard {
        padding: 2rem;
        text-align: center;
    }
    
    h2 {
        margin-bottom: 1.5rem;
    }
    
    .nav-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
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
    
    button:hover {
        background: #388e3c;
    }
</style>