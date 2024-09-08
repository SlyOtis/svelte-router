<script lang="ts">
    import {onMount} from 'svelte';
    import {currentComponent} from './store';
    import {initRouter} from './router';
    import type {Routes} from './types';

    export let routes: Routes
    export let fallback: (() => Promise<any>) | undefined

    let component: any = null;
    let loading = true;

    onMount(() => {
        initRouter(routes);
    });

    $: if ($currentComponent) {
        loading = true;
        $currentComponent().then(module => {
            component = module.default;
            loading = false;
        });
    } else if (fallback !== undefined) {
        loading = true;
        fallback()?.then(module => {
            component = module.default;
            loading = false;
        });
    }
</script>

{#if loading}
    <slot></slot>
{:else}
    <svelte:component this={component}/>
{/if}