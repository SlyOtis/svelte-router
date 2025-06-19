<script lang="ts">
    import {onMount, onDestroy} from 'svelte';
    import {routeStore} from './store';
    import {execFallback, initRouter, navigate} from './router';
    import type {RouteDefinition, Routes} from './types';

    let {routes, fallback}: {routes: Routes, fallback: RouteDefinition} = $props()

    let routeComp: any = $state(null)
    let loading: boolean = true
    let routeProps: any = null
    let isInitialized: any = null
    let routeName: string = $state('')

    onMount(() => {
        initRouter(routes);
        isInitialized = true
    });

    onDestroy(() => {
      console.log('destruction')
    })

    $effect(() => {

    })

    $: if ($routeStore && $routeStore.component) {
        loading = true;
        const {component, ...props} = $routeStore;
        console.log(props)
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

{#key routeName}
{#if loading}
    <slot></slot>
{:else}
    <svelte:component this={routeComp} props={routeProps} />
{/if}