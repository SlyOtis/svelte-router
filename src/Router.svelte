<script lang="ts">
  import {createRouter} from './index'
  
  export let routes: any
  export let restrictions: any

  //TODO:: Improve this.
  function onRouteChanged(route: any) {
    currRoute = route
  }
  
  let currRoute = createRouter({
    routes,
    restrictions,
    onRouteChanged,
    rewriteInvalid: true,
  })
  
</script>


<svelte:head>
  {#if currRoute}
    <title>{currRoute.title}</title>
  {/if}
</svelte:head>

{#if currRoute}
  {#if !currRoute.disableSlot}
    <slot/>
  {/if}
  <svelte:component this={currRoute.comp}/>
{/if}
