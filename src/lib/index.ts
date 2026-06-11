/** Main Router component */
import Router from "./Router.svelte";

/** Core router functions */
import {initRouter, navigate} from "./router";

/** Stores */
import {currentRoute, resolvedRoute, erroneousRoute} from "./store";

/** Type definitions */
export type * from "./types";

/** Exports */
export {
    Router /** Main Router component */,
    initRouter /** Manual router initialization */,
    navigate /** Programmatic navigation */,
    currentRoute /** Current route store with path and params */,
    resolvedRoute /** Resolved route writable store */,
    erroneousRoute /** Erroneous route writable store */,
};
