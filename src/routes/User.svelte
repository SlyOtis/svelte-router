<script lang="ts">
    import { navigate } from "../lib";
    
    export let props: any = null;
    
    $: userId = props?.id || "";
</script>

<section>
    <h1>User Page</h1>
    
    {#if userId}
        <div class="user-info">
            <p><strong>User ID:</strong> {userId}</p>
        </div>
    {/if}
    
    <div class="navigation">
        <button on:click={() => navigate("/")}>Home</button>
        <button on:click={() => navigate("/about")}>About</button>
        <button on:click={() => navigate("/user/test")}>User Test</button>
        <button on:click={() => navigate("/user/123")}>User 123</button>
        <button on:click={() => navigate("/admin")}>Admin</button>
        <button on:click={() => navigate("/shop")}>Shop</button>
    </div>
</section>

<style>
    section {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 1rem;
        max-width: 800px;
        margin: 0 auto;
    }
    
    h1 {
        margin-bottom: 2rem;
    }
    
    .user-info {
        background-color: #bbdefb;
        padding: 1rem;
        border-radius: 4px;
        width: 100%;
        margin-bottom: 2rem;
    }
    
    .navigation {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    button {
        padding: 0.5rem 1rem;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    button:hover {
        background-color: #45a049;
    }
</style>