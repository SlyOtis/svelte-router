import {match, } from 'path-to-regexp';
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
    console.log(parsedUrl.toString());
    updateRouteStore(parsedUrl.toString(), state);
}

function testRoutes(routes: Routes) {
    try {

        Object.keys(routes).forEach(path => {

        })

    } catch (e) {
        throw new Error("Invalid routes, see https://github.com/pillarjs/path-to-regexp for pattern");
    }
}

export function initRouter(routes: Routes) {
    Config.routes = routes;

    testRoutes(routes)
    if (Config.routes === null) {
        throw new Error('Routes not found, run initRoutes');
    }

    updateRouteStore(window.location.href, history.state);

    window.addEventListener('popstate', (event) => {
        console.log('change')
        updateRouteStore(window.location.href, event.state);
    });

    document.body.addEventListener('click', (e) => {
        const target = e.target as HTMLAnchorElement;
        if (target.tagName === 'A' && target.href.startsWith(window.location.origin)) {
            e.preventDefault();
            handleNavigation(target.href, Config.state);
            console.log('change')
        }
    });

    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments as any);
        updateRouteStore(arguments[2] as string, arguments[0]);
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        console.log('change')
        originalReplaceState.apply(this, arguments as any);
        updateRouteStore(arguments[2] as string, arguments[0]);
    };

    const originalAssign = window.location.assign;
    Object.defineProperty(window.location, 'assign', function (url: string) {
        console.log('change')
        handleNavigation(url, Config.state);
    });

    const originalReplace = window.location.replace;
    Object.defineProperty(window.location, 'replace', function (url: string) {
        console.log('change')
        handleNavigation(url, Config.state); //TODO:: Fix state reset
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