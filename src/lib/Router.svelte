<script lang="ts">
  import {onMount} from 'svelte';
  import {execFallback, initRouter} from './router';
  import type {RouteDefinition, Routes} from './types';

  let {routes, fallback, children}: { routes: Routes, fallback: RouteDefinition, children: any } = $props()

  let RouteComp: any = $state(null)
  let loading: boolean = $state(true)
  let routeProps: any = $state(null)
  let isInitialized: boolean = $state(false)
  let routeName: string = $state('')

  onMount(() => {
    const unsubscribe = initRouter(routes).subscribe(({route, hasFallback}) => {
      console.log("we got some", route)
      if (route !== null) {
        if (routeName === route.name) {
          return
        }

        loading = true;
        const {component, ...props} = route;
        component().then((module: any) => {
          RouteComp = module.default;
          routeProps = props;
          routeName = route.name
          loading = false;
          console.log(routeName)
        });
      } else if (fallback !== undefined && isInitialized && hasFallback) {
        loading = true;
        execFallback(fallback)().then(module => {
          RouteComp = module.default;
          routeProps = null;
          loading = false;
          routeName = '__fallback'
        })
      }
    });

    isInitialized = true
    return () => {
      unsubscribe()
    }
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