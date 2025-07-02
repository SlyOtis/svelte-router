<script lang="ts">
  import {onMount, getContext, setContext} from 'svelte';
  import {writable} from 'svelte/store';
  import {createRouteResolver, createErrorHandler, initRouter} from './router';
  import {resolvedRoute, erroneousRoute, currentRoute} from './store';
  import type {RouteDefinition, Routes, RouterContext} from './types';

  let {routes, fallback, children}: { routes: Routes, fallback: RouteDefinition, children: any } = $props()

  const {resolveStore, errorStore, isRoot, parentRoute}: RouterContext = getContext('sly-router') || {
    resolveStore: resolvedRoute,
    errorStore: erroneousRoute,
    isRoot: true
  };

  const unresolvedRoute = writable<{ path: string, segments: string[] } | null>(null);
  const routeError = writable<{ error: string, path: string } | null>(null);
  
  const resolvedComponent = createRouteResolver(resolveStore, routes, isRoot, unresolvedRoute);
  const fallbackComponent = createErrorHandler(errorStore, fallback);

  setContext('sly-router', {
    resolveStore: unresolvedRoute,
    errorStore: routeError,
    isRoot: false,
    parentRoute
  });

  $effect(() => {
    if ($resolvedComponent.component && !$resolvedComponent.loading) {
      currentRoute.set({
        path: $resolveStore?.path || '',
        params: $resolvedComponent.props?.params || {},
        parentPath: parentRoute || $resolveStore?.path || ''
      });
    }
  });


  onMount(() => {
    if (isRoot) {
      initRouter(parentRoute, routes);
    }
  });

  const RouteComp = $derived($fallbackComponent.component || $resolvedComponent.component);
  const activeProps = $derived($fallbackComponent.props || $resolvedComponent.props);
  const activeName = $derived($fallbackComponent.name || $resolvedComponent.name);
  const isLoading = $derived($resolvedComponent.loading || $fallbackComponent.loading);
</script>

{#key activeName}
    {#if isLoading}
        {@render children?.()}
    {:else if RouteComp}
        <RouteComp props={activeProps} ></RouteComp>
    {/if}
{/key}