<script lang="ts">
    import {onMount} from 'svelte';
    import {routeStore} from './store';
    import {initRouter} from './router';
    import type {Routes} from './types';

    export let routes: Routes
    export let fallback: (() => Promise<any>) | undefined

    let routeComp: any = null;
    let loading = true;
    let routeProps: any = null

    onMount(() => {
        initRouter(routes);
    });

    $: if ($routeStore && $routeStore.component) {
        loading = true;
        const {component, ...props} = $routeStore;
        component().then(module => {
            routeComp = module.default;
            routeProps = props;
            loading = false;
        });
    } else if (fallback !== undefined) {
        loading = true;
        fallback()?.then(module => {
            routeComp = module.default;
            routeProps = null
            loading = false;
        });
    }
</script>

{#if loading}
    <slot></slot>
{:else}
    <svelte:component this={routeComp} props={routeProps} />
{/if}