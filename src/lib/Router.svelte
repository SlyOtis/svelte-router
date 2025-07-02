<script lang="ts">
  import {onMount, getContext, setContext} from 'svelte';
  import {writable, type Writable} from 'svelte/store';
  import {resolveRoute} from './router';
  import {globalUnresolvedRoute, globalRegisteredRoutes, globalRouteError} from './store';
  import type {RouteDefinition, Routes} from './types';

  let {routes, fallback, children}: { routes: Routes, fallback: RouteDefinition, children: any } = $props()

  let RouteComp: any = $state(null)
  let loading: boolean = $state(true)
  let routeProps: any = $state(null)
  let routeName: string = $state('')

  $effect(() => {
    console.log('🔄 Router state changed:', {RouteComp: !!RouteComp, loading, routeName});
  });

  const parentRouterContext: {
    resolve: Writable<{path: string, segments: string[]} | null>;
    error: Writable<{error: string, unresolvedPath: string} | null>;
  } | null = getContext('sly-router') || null;
  
  const unresolvedRouteStore = parentRouterContext?.resolve || globalUnresolvedRoute;
  const routeErrorStore = parentRouterContext?.error || globalRouteError;
  
  const childUnresolvedRoute = writable<{path: string, segments: string[]} | null>(null);
  const childRouteError = writable<{error: string, unresolvedPath: string} | null>(null);
  
  setContext('sly-router', {
    resolve: childUnresolvedRoute,
    error: childRouteError
  });

  onMount(() => {
    console.log('🚀 Router mounted with routes:', Object.keys(routes));
    globalRegisteredRoutes.update(registered => ({...registered, ...routes}));

    const unsubscribeUnresolved = unresolvedRouteStore.subscribe(unresolved => {
      console.log('📍 Unresolved route changed:', unresolved);
      if (!unresolved) return;
      
      console.log('🔍 Resolving segments:', unresolved.segments, 'with routes:', Object.keys(routes));
      const result = resolveRoute(unresolved.segments, routes);
      console.log('✅ Resolve result:', result);
      
      if (result.matched) {
        console.log('🎯 Route matched:', result.matched.name);
        loading = true;
        const {component, params, name} = result.matched;
        component().then((module: any) => {
          console.log('📦 Component loaded:', name);
          RouteComp = module.default;
          routeProps = {params};
          routeName = name;
          loading = false;
        });
        
        if (result.remaining.length > 0) {
          console.log('⬇️ Passing remaining segments to child:', result.remaining);
          childUnresolvedRoute.set({
            path: '/' + result.remaining.join('/'),
            segments: result.remaining
          });
        } else {
          console.log('✨ Route fully resolved');
          childUnresolvedRoute.set(null);
        }
      } else if (fallback) {
        console.log('🛟 Using fallback route');
        loading = true;
        if (typeof fallback === 'function') {
          fallback().then(module => {
            RouteComp = module.default;
            routeProps = null;
            loading = false;
            routeName = '__fallback';
          });
        }
      } else {
        console.log('❌ Route not found, setting error');
        childRouteError.set({
          error: 'Route not found',
          unresolvedPath: unresolved.path
        });
      }
    });

    const unsubscribeError = childRouteError.subscribe(error => {
      console.log('🚨 Child route error:', error);
      if (error) {
        if (fallback) {
          console.log('🛟 Handling error with fallback');
          loading = true;
          if (typeof fallback === 'function') {
            fallback().then(module => {
              RouteComp = module.default;
              routeProps = null;
              loading = false;
              routeName = '__fallback';
            });
          } else if (typeof fallback === 'string') {
            console.log('🔄 Redirecting to fallback:', fallback);
            const segments = fallback.split('/').filter(Boolean);
            globalUnresolvedRoute.set({
              path: fallback,
              segments
            });
          } else if ("component" in fallback) {
            fallback.component().then(module => {
              RouteComp = module.default;
              routeProps = null;
              loading = false;
              routeName = '__fallback';
            });
          }
          childRouteError.set(null);
        } else {
          console.log('⬆️ Propagating error to parent');
          routeErrorStore.set(error);
        }
      }
    });

    return () => {
      unsubscribeUnresolved();
      unsubscribeError();
    };
  });
</script>

{#key routeName}
    <div >hello</div>
    {#if loading}
        {@render children?.()}
    {:else if RouteComp}
        <div>test</div>
        <RouteComp props={routeProps}></RouteComp>
    {/if}
{/key}