import {match} from "path-to-regexp";
import type {MatchedLocationRoute, MatchedRoute, RouteDefinition, RouteParams, Routes} from "./types";
import {routerStore, routeStore} from "./store";
import {derived, type Readable} from "svelte/store";

class Config {
    public static routes: Routes | null = null;
    public static state: any = null;
}

function parseQueryParams(search: string): Map<string, string> {
    const params = new Map<string, string>();
    new URLSearchParams(search).forEach((value, key) => {
        params.set(key, value);
    });
    return params;
}

function sortRouteKeys(routes: Routes) {
    return Object.keys(routes).sort((a, b) => {
        // Count slashes
        const slashCountA = (a.match(/\//g) || []).length;
        const slashCountB = (b.match(/\//g) || []).length;

        // If slash counts are different, sort by slash count
        if (slashCountA !== slashCountB) {
            return slashCountB - slashCountA;
        }

        // If slash counts are the same, compare segment lengths
        const segmentsA = a.split('/').filter(Boolean);
        const segmentsB = b.split('/').filter(Boolean);

        for (let i = 0; i < Math.min(segmentsA.length, segmentsB.length); i++) {
            if (segmentsA[i].length !== segmentsB[i].length) {
                return segmentsB[i].length - segmentsA[i].length;
            }
        }

        // If all segments have the same length, maintain original order
        return 0;
    });
}

// TODO:: Allow sorting override?
function findMatchingRoute(pathname: string, routes: Routes): MatchedRoute | null {
    try {
        for (const routePath of sortRouteKeys(routes)) {
            const matchFn = match(routePath, {decode: decodeURIComponent});
            const result = matchFn(pathname);
            if (result) {
                const routeData = routes[routePath]

                if (typeof routeData === 'string') {
                    setLocation(routeData)
                    return findMatchingRoute(routeData, routes)
                } else if (typeof routeData === 'function') {
                    return {
                        params: result.params as RouteParams,
                        name: routePath,
                        component: routeData,
                    };
                } else if ("name" in routeData && "component" in routeData) {
                    return {
                        params: result.params as RouteParams,
                        name: routeData.name,
                        component: routeData.component,
                    }
                }
                throw new Error("Invalid route data")
            }
        }
    } catch (e) {
        console.warn("Invalid path definition", pathname);
    }

    return null;
}

function getLocationRoute(url: string, routes: Routes): MatchedLocationRoute | null {
    const parsedUrl = new URL(url, window.location.origin)
    const matchedRoute = findMatchingRoute(parsedUrl.pathname, routes)
    return matchedRoute ? {
        ...matchedRoute,
        url: parsedUrl,
    } : null
}

function setLocation(url: string) {
    const parsedUrl = new URL(url, window.location.origin)
    if (window.location.pathname !== parsedUrl.pathname) {
        window.location.pathname = parsedUrl.pathname;
    }
    if (window.location.hash !== parsedUrl.hash) {
        window.location.hash = parsedUrl.hash;
    }
    if (window.location.hostname !== parsedUrl.hostname) {
        window.location.hostname = parsedUrl.hostname;
    }
}

function updateRouteStore(url: string, state: any = null): MatchedRoute | null {
    const matchedRoute = getLocationRoute(url, getRoutes())
    routerStore.set(matchedRoute)

    if (!matchedRoute) {
        throw new Error("Route not found for url: " + url);
    }

    const {url: {pathname, search, hash}, params, component, name} = matchedRoute

    Config.state = state;

    // TODO:: What to do when there are no route?? hmmm
    routeStore.update((route) => ({
        ...route,
        pathname,
        search,
        hash,
        state: state || {},
        queryParams: parseQueryParams(search),
        params,
        component,
        name,
    }));

    return matchedRoute
}

function handleNavigation(url: string, state: any = null) {
    const parsedUrl = new URL(url, window.location.origin);
    history.pushState(state, "", parsedUrl.toString());
    updateRouteStore(parsedUrl.toString(), state);
}

function testRoutes(routes: Routes) {
    try {
        Object.keys(routes).forEach((path) => {});
    } catch (e) {
        throw new Error(
            "Invalid routes, see https://github.com/pillarjs/path-to-regexp for pattern",
        );
    }
}

export function initRouter(routes: Routes): Readable<{ hasFallback: boolean, route: MatchedLocationRoute | null }> {
    testRoutes(routes);

    console.log('Nested test', window.location.href)

    if (Config.routes == null) {
        Config.routes = routes;
    } else {
        Config.routes = {...Config.routes, ...routes} // TODO:: CHeck for collisions
    }

    updateRouteStore(window.location.href, history.state);

    window.addEventListener("popstate", (event) => {
        updateRouteStore(window.location.href, event.state);
    });

    document.body.addEventListener("click", (e) => {
        const target = e.target as HTMLAnchorElement;
        if (
            target.tagName === "A" &&
            target.href.startsWith(window.location.origin)
        ) {
            e.preventDefault();
            handleNavigation(target.href, Config.state);
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

    // const originalAssign = window.location.assign;
    Object.defineProperty(window.location, "assign", function (url: string) {
        handleNavigation(url, Config.state);
    });

    // const originalReplace = window.location.replace;
    Object.defineProperty(window.location, "replace", function (url: string) {
        handleNavigation(url, Config.state); //TODO:: Fix state reset
    });

    return derived(routerStore, state => {
        const route = getLocationRoute(window.location.href, routes)
        return {hasFallback: state === null && route === null, route};
    });
}

export function execFallback(fallback: RouteDefinition): () => Promise<any> {
    if (Config.routes === null) {
        throw new Error("Routes not found, run initRoutes");
    }

    if (typeof fallback === 'function') {
        return fallback
    } else if (typeof fallback === 'string') { //TODO:: What to do with state here?
        const matchedRoute = getLocationRoute(fallback, getRoutes())
        if (!matchedRoute) {
            throw new Error("Routes not found or invalid fallback " + fallback + ", run initRoutes");
        }
        setLocation(fallback)
        return matchedRoute.component
    } else {
        return fallback.component
    }
}

export function navigate(path: string, state: any = null) {
    handleNavigation(path, state); // Note: This won't work correctly as is, we need to pass routes
}

export function getRoutes(): Routes {
    if (Config.routes === null) {
        throw new Error("Routes not found, run initRoutes");
    }

    return Config.routes;
}
