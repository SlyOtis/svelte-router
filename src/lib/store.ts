import {derived, type Readable, writable} from "svelte/store";
import type {MatchedLocationRoute, RouteComponent, RouteInfo, RouteParams, Routes} from "./types";

export const globalUnresolvedRoute = writable<{path: string, segments: string[]}>({
    path: window.location.pathname,
    segments: window.location.pathname.split('/').filter(Boolean)
});

export const globalRegisteredRoutes = writable<Routes>({});

export const globalRouteError = writable<{error: string, unresolvedPath: string} | null>(null);

export const routerStore = writable<MatchedLocationRoute | null>(null);

export const routeStore = writable<RouteInfo>({
    name: "",
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    state: history.state || {},
    queryParams: new Map(),
    params: {},
    component: null
});

export const currentRoute: Readable<string> = derived(routeStore, $route => $route.pathname);
export const queryParams: Readable<Map<string, string>> = derived(routeStore, $route => $route.queryParams);
export const routeState: Readable<any> = derived(routeStore, $route => $route.state);
export const routeHash: Readable<string> = derived(routeStore, $route => $route.hash);
export const routeParams: Readable<RouteParams> = derived(routeStore, $route => $route.params);
export const currentComponent: Readable<RouteComponent | null> = derived(routeStore, $route => $route.component);
export const routeName: Readable<string | null> = derived(routeStore, $route => $route.name);