<script lang="ts">
  import {onMount, getContext, setContext} from 'svelte';
  import {writable, type Writable} from 'svelte/store';
  import {resolveRoute, initRouter} from './router';
  import {globalUnresolvedRoute, globalRegisteredRoutes, globalRouteError, currentRoute} from './store';
  import type {RouteDefinition, Routes} from './types';

  let {routes, fallback, children}: { routes: Routes, fallback: RouteDefinition, children: any } = $props()

  let RouteComp: any = $state(null)
  let loading: boolean = $state(true)
  let routeProps: any = $state(null)
  let routeName: string = $state('')

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
    if (!parentRouterContext) {
      initRouter();
    }
    
    globalRegisteredRoutes.update(registered => ({...registered, ...routes}));

    const unsubscribeUnresolved = unresolvedRouteStore.subscribe(unresolved => {
      if (!unresolved) return;
      
      const result = resolveRoute(unresolved.segments, routes);
      
      if (result.matched) {
        loading = true;
        const {component, params, name} = result.matched;
        currentRoute.set({
          path: unresolved.path,
          params: params || {}
        });
        component().then((module: any) => {
          RouteComp = module.default;
          routeProps = {params};
          routeName = name;
          loading = false;
        });
        
        if (result.remaining.length > 0) {
          childUnresolvedRoute.set({
            path: '/' + result.remaining.join('/'),
            segments: result.remaining
          });
        } else {
          childUnresolvedRoute.set({
            path: '/',
            segments: []
          });
        }
      } else if (fallback) {
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
        childRouteError.set({
          error: 'Route not found',
          unresolvedPath: unresolved.path
        });
      }
    });

    const unsubscribeError = childRouteError.subscribe(error => {
      if (error) {
        if (fallback) {
          loading = true;
          if (typeof fallback === 'function') {
            fallback().then(module => {
              RouteComp = module.default;
              routeProps = null;
              loading = false;
              routeName = '__fallback';
            });
          } else if (typeof fallback === 'string') {
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
          routeErrorStore.set(error);
        }
      }
    });

    if (parentRouterContext) {
      const unsubscribeImmediate = unresolvedRouteStore.subscribe((value: {path: string, segments: string[]} | null) => {
        if (value) {
          const result = resolveRoute(value.segments, routes);
          if (result.matched) {
            loading = true;
            const {component, params, name} = result.matched;
            currentRoute.set({
              path: value.path,
              params: params || {}
            });
            component().then((module: any) => {
              RouteComp = module.default;
              routeProps = {params};
              routeName = name;
              loading = false;
            });
            
            if (result.remaining.length > 0) {
              childUnresolvedRoute.set({
                path: '/' + result.remaining.join('/'),
                segments: result.remaining
              });
            } else {
              childUnresolvedRoute.set({
                path: '/',
                segments: []
              });
            }
          }
        }
      });
      unsubscribeImmediate();
    }

    return () => {
      unsubscribeUnresolved();
      unsubscribeError();
    };
  });
</script>

{#key routeName}
    {#if loading}
        {@render children?.()}
    {:else if RouteComp}
        <RouteComp props={routeProps}></RouteComp>
    {/if}
{/key}