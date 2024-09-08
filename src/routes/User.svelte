<script lang="ts">
    import {onMount} from "svelte";
    import type {RouteProps} from "../lib";

    export let props: RouteProps | null = null;

    onMount(() => {
        if (props != null) {
            console.log(props)
        }
    })

</script>

<section>
    <h1>User</h1>
</section>

<style>
    section {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
    }
</style>
