<script lang="ts">
  import {onMount, getContext, setContext} from 'svelte';
  import {writable} from 'svelte/store';
  import {createRouteResolver, createErrorHandler, initRouter} from './router';
  import {resolvedRoute, erroneousRoute, currentRoute} from './store';
  import type {RouteDefinition, Routes, RouterContext} from './types';

  let {routes, fallback, children}: { routes: Routes, fallback: RouteDefinition, children: any } = $props()

  const {
    resolveStore,
    errorStore,
    isRoot,
    parentRoute,
    previousComponent
  }: RouterContext = getContext('sly-router') || {
    resolveStore: resolvedRoute,
    errorStore: erroneousRoute,
    previousComponent: writable(),
    isRoot: true
  };

  const unresolvedRoute = writable<{ path: string, segments: string[] } | null>(null);
  const routeError = writable<{ error: string, path: string } | null>(null);

  const resolvedComponent = createRouteResolver(resolveStore, routes, unresolvedRoute);
  const fallbackComponent = createErrorHandler(errorStore, fallback);

  setContext('sly-router', {
    resolveStore: unresolvedRoute,
    errorStore: routeError,
    isRoot: false,
    parentRoute,
    previousComponent: writable()
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
      resolvedRoute.set({
        path: window.location.pathname,
        segments: window.location.pathname.split('/').filter(Boolean)
      });
    }
  });

  const RouteComp = $derived($fallbackComponent.component || $resolvedComponent.component);
  const activeProps = $derived($fallbackComponent.props || $resolvedComponent.props);
  const activeName = $derived($fallbackComponent.name || $resolvedComponent.name);
  const isLoading = $derived($resolvedComponent.loading || $fallbackComponent.loading);
  const PrevComp = $previousComponent

  let showPrevious = $state(false);
  let timeout: number | null | any = null;

  $effect(() => {
    if (timeout) clearTimeout(timeout);

    if (RouteComp && !isLoading) {
      showPrevious = false;
      if (previousComponent) $previousComponent = RouteComp;
    } else if (isLoading && previousComponent && $previousComponent) {
      showPrevious = true;
      timeout = setTimeout(() => showPrevious = false, 1000);
    }
  });
</script>

{#key activeName}
    {#if showPrevious && PrevComp}
        <PrevComp props={activeProps}></PrevComp>
    {:else if !isLoading && RouteComp}
        <RouteComp props={activeProps}></RouteComp>
    {:else}
        {@render children?.()}
    {/if}
{/key}