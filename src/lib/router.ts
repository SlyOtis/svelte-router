import {match} from 'path-to-regexp';
import type {RouteParams, Routes} from "./types";
import {routeStore} from "./store";

class Config {
    public static routes: Routes | null = null
    public static state: any = null
}

function parseQueryParams(search: string): Map<string, string> {
    const params = new Map<string, string>();
    new URLSearchParams(search).forEach((value, key) => {
        params.set(key, value);
    });
    return params;
}

function findMatchingRoute(pathname: string): {
    params: RouteParams;
    component: () => Promise<any>
} | null {

    let routes = getRoutes()
    for (const routePath of Object.keys(routes)) {
        const matchFn = match(routePath, {decode: decodeURIComponent});
        const result = matchFn(pathname);
        if (result) {
            return {params: result.params as RouteParams, component: routes[routePath]};
        }
    }
    return null;
}

function updateRouteStore(url: string, state: any = null) {
    const parsedUrl = new URL(url, window.location.origin);
    const matchedRoute = findMatchingRoute(parsedUrl.pathname);

    Config.state = state;

    routeStore.update(route => ({
        ...route,
        pathname: parsedUrl.pathname,
        search: parsedUrl.search,
        hash: parsedUrl.hash,
        state: state || {},
        queryParams: parseQueryParams(parsedUrl.search),
        params: matchedRoute ? matchedRoute.params : {},
        component: matchedRoute ? matchedRoute.component : null
    }));
}

function handleNavigation(url: string, state: any = null) {
    const parsedUrl = new URL(url, window.location.origin);
    history.pushState(state, '', parsedUrl.toString());
    updateRouteStore(parsedUrl.toString(), state);
}

export function initRouter(routes: Routes) {
    Config.routes = routes;

    if (Config.routes === null) {
        throw new Error('Routes not found, run initRoutes');
    }

    updateRouteStore(window.location.href, history.state);

    window.addEventListener('popstate', (event) => {
        updateRouteStore(window.location.href, event.state);
    });

    document.body.addEventListener('click', (e) => {
        const target = e.target as HTMLAnchorElement;
        if (target.tagName === 'A' && target.href.startsWith(window.location.origin)) {
            e.preventDefault();
            handleNavigation(target.href, null);
        }
    });

    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments as any);
        updateRouteStore(arguments[2] as string, arguments[0]);
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments as any);
        updateRouteStore(arguments[2] as string, arguments[0]);
    };

    const originalAssign = window.location.assign;
    window.location.assign = function (url: string) {
        handleNavigation(url, null);
    };

    const originalReplace = window.location.replace;
    window.location.replace = function (url: string) {
        handleNavigation(url, null); //TODO:: Fix state reset
    };

    // TODO:: Do the same for pathname?

    Object.defineProperty(window.location, 'href', {
        set: function (href: string) {
            handleNavigation(href, null);
        }
    });
}

export function navigate(path: string, state: any = null) {
    handleNavigation(path, state);  // Note: This won't work correctly as is, we need to pass routes
}


export function getRoutes(): Routes {
    if (Config.routes === null) {
        throw new Error('Routes not found, run initRoutes');
    }

    return Config.routes;
}