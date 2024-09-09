/** Main Router component */
import Router from "./Router.svelte";

/** Core router functions */
import {initRouter, getRoutes, navigate} from "./router";

/** Reactive stores for route information */
import {
    currentComponent,
    queryParams,
    routeParams,
    routeHash,
    routeState,
    currentRoute,
    routeName,
} from "./store";

/** Type definitions */
export type * from "./types";

/** Exports */
export {
    Router /** Main Router component */,
    initRouter /** Initialize the router */,
    getRoutes /** Get configured routes */,
    navigate /** Programmatic navigation */,
    currentComponent /** Current route component */,
    queryParams /** Query parameters */,
    routeParams /** Route parameters */,
    routeHash /** URL hash */,
    routeState /** Route state */,
    currentRoute /** Current route path */,
    routeName /** Current route name */,
};
