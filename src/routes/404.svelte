<script lang="ts">
    import type {RouteProps} from "../lib";
    export let props: RouteProps | null = null;

</script>

<section>
    <h1>404</h1>
    <button on:click={() => window.history.back()}>Back</button>
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
