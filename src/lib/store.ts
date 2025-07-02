import {writable} from "svelte/store";
import type {ResolvedRouteStore, ErroneousRouteStore, CurrentRouteStore} from "./types";

export const resolvedRoute = writable<ResolvedRouteStore>({
    path: window.location.pathname,
    segments: window.location.pathname.split('/').filter(Boolean)
});

export const erroneousRoute = writable<ErroneousRouteStore>(null);

export const currentRoute = writable<CurrentRouteStore>({
    path: window.location.pathname,
    parentPath: window.location.pathname,
    params: {}
});