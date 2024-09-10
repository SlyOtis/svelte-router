<script>import { onMount } from "svelte";
import { routeStore } from "./store";
import { execFallback, initRouter, navigate } from "./router";
export let routes;
export let fallback;
let routeComp = null;
let loading = true;
let routeProps = null;
let isInitialized = null;
onMount(() => {
  initRouter(routes);
  isInitialized = true;
});
$: if ($routeStore && $routeStore.component) {
  loading = true;
  const { component, ...props } = $routeStore;
  component().then((module) => {
    routeComp = module.default;
    routeProps = props;
    loading = false;
  });
} else if (fallback !== void 0 && isInitialized) {
  loading = true;
  execFallback(fallback)().then((module) => {
    routeComp = module.default;
    routeProps = null;
    loading = false;
  });
}
</script>

{#if loading}
    <slot></slot>
{:else}
    <svelte:component this={routeComp} props={routeProps} />
{/if}