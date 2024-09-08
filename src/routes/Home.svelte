<script lang="ts">
    import {onMount} from "svelte";
    import {navigate, type RouteProps} from "../lib";

    export let props: RouteProps | null = null;

    onMount(() => {
        if (props != null) {
            console.log(props)
        }
    })
</script>


<section>
    <h1>About</h1>
    <button on:click={() => navigate("/user/test")}>Go to user</button>
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