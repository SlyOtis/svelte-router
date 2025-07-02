import {writable} from "svelte/store";
import type {Routes, RouteParams} from "./types";

export const globalUnresolvedRoute = writable<{path: string, segments: string[]}>({
    path: window.location.pathname,
    segments: window.location.pathname.split('/').filter(Boolean)
});

export const globalRegisteredRoutes = writable<Routes>({});

export const globalRouteError = writable<{error: string, unresolvedPath: string} | null>(null);

export const currentRoute = writable<{path: string, params: RouteParams}>({
    path: window.location.pathname,
    params: {}
});