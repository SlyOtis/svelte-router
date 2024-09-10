import { derived, writable } from "svelte/store";
export const routeStore = writable({
    name: "",
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    state: history.state || {},
    queryParams: new Map(),
    params: {},
    component: null
});
export const currentRoute = derived(routeStore, $route => $route.pathname);
export const queryParams = derived(routeStore, $route => $route.queryParams);
export const routeState = derived(routeStore, $route => $route.state);
export const routeHash = derived(routeStore, $route => $route.hash);
export const routeParams = derived(routeStore, $route => $route.params);
export const currentComponent = derived(routeStore, $route => $route.component);
export const routeName = derived(routeStore, $route => $route.name);
