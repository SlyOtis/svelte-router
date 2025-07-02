/** Main Router component */
import Router from "./Router.svelte";

/** Core router functions */
import {initRouter, navigate} from "./router";

/** Type definitions */
export type * from "./types";

/** Exports */
export {
    Router /** Main Router component */,
    initRouter /** Manual router initialization */,
    navigate /** Programmatic navigation */,
};
