<script lang="ts">

</script>

<section>
    <h1>Fallback</h1>
    <button on:click={ () => window.location.href === "/"}>Back</button>
</section>

<style>
    section {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
</style>