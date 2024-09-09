<script lang="ts">
    import {onMount} from 'svelte';
    import {routeStore} from './store';
    import {execFallback, initRouter, navigate} from './router';
    import type {RouteDefinition, Routes} from './types';

    export let routes: Routes
    export let fallback: RouteDefinition

    let routeComp: any = null
    let loading = true
    let routeProps: any = null
    let isInitialized: any = null


    onMount(() => {
        initRouter(routes);
        isInitialized = true
    });

    $: if ($routeStore && $routeStore.component) {
        loading = true;
        const {component, ...props} = $routeStore;
        component().then(module => {
            routeComp = module.default;
            routeProps = props;
            loading = false;
        });
    } else if (fallback !== undefined && isInitialized) {
        loading = true;
        execFallback(fallback)().then(module => {
            routeComp = module.default;
            routeProps = null;
            loading = false;
        })
    }
</script>

{#if loading}
    <slot></slot>
{:else}
    <svelte:component this={routeComp} props={routeProps} />
{/if}