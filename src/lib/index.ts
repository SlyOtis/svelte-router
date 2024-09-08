import {initRouter, getRoutes, navigate} from "./router";
import Router from "./Router.svelte";

export {currentComponent, queryParams, routeParams, routeHash, routeState, currentRoute} from "./store";
export type * from "./types"

export {
    Router,
    initRouter,
    getRoutes,
    navigate
}

export default Router