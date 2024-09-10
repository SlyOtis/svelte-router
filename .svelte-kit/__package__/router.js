import { match } from "path-to-regexp";
import { routeStore } from "./store";
class Config {
    static routes = null;
    static state = null;
}
function parseQueryParams(search) {
    const params = new Map();
    new URLSearchParams(search).forEach((value, key) => {
        params.set(key, value);
    });
    return params;
}
function findMatchingRoute(pathname) {
    let routes = getRoutes();
    for (const routePath of Object.keys(routes)) {
        const matchFn = match(routePath, { decode: decodeURIComponent });
        const result = matchFn(pathname);
        if (result) {
            const routeData = routes[routePath];
            if (typeof routeData === 'string') {
                setLocation(routeData);
                return findMatchingRoute(routeData);
            }
            else if (typeof routeData === 'function') {
                return {
                    params: result.params,
                    name: routePath,
                    component: routeData,
                };
            }
            else if ("name" in routeData && "component" in routeData) {
                return {
                    params: result.params,
                    name: routeData.name,
                    component: routeData.component,
                };
            }
            throw new Error("Invalid route data");
        }
    }
    return null;
}
function getLocationRoute(url) {
    const parsedUrl = new URL(url, window.location.origin);
    const matchedRoute = findMatchingRoute(parsedUrl.pathname);
    return matchedRoute ? {
        ...matchedRoute,
        url: parsedUrl,
    } : null;
}
function setLocation(url) {
    const parsedUrl = new URL(url, window.location.origin);
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
function updateRouteStore(url, state = null) {
    const matchedRoute = getLocationRoute(url);
    if (!matchedRoute) {
        throw new Error("Route not found for url: " + url);
    }
    const { url: { pathname, search, hash }, params, component, name } = matchedRoute;
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
    return matchedRoute;
}
function handleNavigation(url, state = null) {
    const parsedUrl = new URL(url, window.location.origin);
    history.pushState(state, "", parsedUrl.toString());
    updateRouteStore(parsedUrl.toString(), state);
}
function testRoutes(routes) {
    try {
        Object.keys(routes).forEach((path) => {
        });
    }
    catch (e) {
        throw new Error("Invalid routes, see https://github.com/pillarjs/path-to-regexp for pattern");
    }
}
export function initRouter(routes) {
    Config.routes = routes;
    testRoutes(routes);
    if (Config.routes === null) {
        throw new Error("Routes not found, run initRoutes");
    }
    updateRouteStore(window.location.href, history.state);
    window.addEventListener("popstate", (event) => {
        updateRouteStore(window.location.href, event.state);
    });
    document.body.addEventListener("click", (e) => {
        const target = e.target;
        if (target.tagName === "A" &&
            target.href.startsWith(window.location.origin)) {
            e.preventDefault();
            handleNavigation(target.href, Config.state);
        }
    });
    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        updateRouteStore(arguments[2], arguments[0]);
    };
    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        updateRouteStore(arguments[2], arguments[0]);
    };
    const originalAssign = window.location.assign;
    Object.defineProperty(window.location, "assign", function (url) {
        handleNavigation(url, Config.state);
    });
    const originalReplace = window.location.replace;
    Object.defineProperty(window.location, "replace", function (url) {
        handleNavigation(url, Config.state); //TODO:: Fix state reset
    });
    return true;
}
export function execFallback(fallback) {
    if (Config.routes === null) {
        throw new Error("Routes not found, run initRoutes");
    }
    if (typeof fallback === 'function') {
        return fallback;
    }
    else if (typeof fallback === 'string') { //TODO:: What to do with state here?
        const matchedRoute = getLocationRoute(fallback);
        if (!matchedRoute) {
            throw new Error("Routes not found or invalid fallback " + fallback + ", run initRoutes");
        }
        setLocation(fallback);
        return matchedRoute.component;
    }
    else {
        return fallback.component;
    }
}
export function navigate(path, state = null) {
    handleNavigation(path, state); // Note: This won't work correctly as is, we need to pass routes
}
export function getRoutes() {
    if (Config.routes === null) {
        throw new Error("Routes not found, run initRoutes");
    }
    return Config.routes;
}
