import {match} from "path-to-regexp";
import type {MatchedLocationRoute, MatchedRoute, RouteDefinition, RouteParams, Routes} from "./types";
import {globalUnresolvedRoute, globalRouteError} from "./store";
import {derived, type Readable} from "svelte/store";


function parseQueryParams(search: string): Map<string, string> {
    const params = new Map<string, string>();
    new URLSearchParams(search).forEach((value, key) => {
        params.set(key, value);
    });
    return params;
}

function isValidRoutePattern(pattern: string): boolean {
    if (!pattern || typeof pattern !== 'string') return false;
    if (pattern === '/') return true;
    
    try {
        match(pattern, {decode: decodeURIComponent});
        return true;
    } catch {
        return false;
    }
}

export function resolveRoute(segments: string[], routes: Routes): {
    matched: MatchedRoute | null;
    remaining: string[];
} {
    if (segments.length === 0) {
        if (routes['/']) {
            const routeData = routes['/'];
            if (typeof routeData === 'string') {
                const redirectSegments = routeData.split('/').filter(Boolean);
                return resolveRoute(redirectSegments, routes);
            } else if (typeof routeData === 'function') {
                return {
                    matched: {
                        params: {},
                        name: '/',
                        component: routeData,
                    },
                    remaining: []
                };
            } else if ("name" in routeData && "component" in routeData) {
                return {
                    matched: {
                        params: {},
                        name: routeData.name,
                        component: routeData.component,
                    },
                    remaining: []
                };
            }
        }
        return {matched: null, remaining: []};
    }

    const sortedRouteKeys = Object.keys(routes)
        .filter(isValidRoutePattern)
        .sort((a, b) => {
            if (a.length !== b.length) {
                return b.length - a.length;
            }
            
            const segmentsA = a.split('/').filter(Boolean);
            const segmentsB = b.split('/').filter(Boolean);
            if (segmentsA.length !== segmentsB.length) {
                return segmentsB.length - segmentsA.length;
            }
            
            for (let i = 0; i < Math.min(segmentsA.length, segmentsB.length); i++) {
                const isParamA = segmentsA[i].startsWith(':');
                const isParamB = segmentsB[i].startsWith(':');
                if (isParamA !== isParamB) {
                    return isParamA ? 1 : -1;
                }
            }
            
            return 0;
        });

    for (const routePath of sortedRouteKeys) {
        const routeSegments = routePath.split('/').filter(Boolean);
        
        if (routeSegments.length > segments.length) {
            continue;
        }
        
        const testPath = routeSegments.length === 0 ? '/' : '/' + segments.slice(0, routeSegments.length).join('/');
        
        try {
            const matchFn = match(routePath, {decode: decodeURIComponent});
            const result = matchFn(testPath);
            
            if (result) {
                const routeData = routes[routePath];
                const remaining = segments.slice(routeSegments.length);
                
                if (typeof routeData === 'string') {
                    const redirectSegments = routeData.split('/').filter(Boolean);
                    return resolveRoute([...redirectSegments, ...remaining], routes);
                } else if (typeof routeData === 'function') {
                    return {
                        matched: {
                            params: result.params as RouteParams,
                            name: routePath,
                            component: routeData,
                        },
                        remaining
                    };
                } else if ("name" in routeData && "component" in routeData) {
                    return {
                        matched: {
                            params: result.params as RouteParams,
                            name: routeData.name,
                            component: routeData.component,
                        },
                        remaining
                    };
                }
            }
        } catch {
            continue;
        }
    }
    
    return {matched: null, remaining: segments};
}


export function initRouter() {
    if (typeof window === 'undefined') return;
    
    globalUnresolvedRoute.set({
        path: window.location.pathname,
        segments: window.location.pathname.split('/').filter(Boolean)
    });

    window.addEventListener("popstate", (event) => {
        globalUnresolvedRoute.set({
            path: window.location.pathname,
            segments: window.location.pathname.split('/').filter(Boolean)
        });
    });

    document.body.addEventListener("click", (e) => {
        const target = e.target as HTMLAnchorElement;
        if (
            target.tagName === "A" &&
            target.href.startsWith(window.location.origin)
        ) {
            e.preventDefault();
            const url = new URL(target.href);
            globalUnresolvedRoute.set({
                path: url.pathname,
                segments: url.pathname.split('/').filter(Boolean)
            });
            history.pushState(null, "", target.href);
        }
    });

    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments as any);
        const url = new URL(arguments[2] as string, window.location.origin);
        globalUnresolvedRoute.set({
            path: url.pathname,
            segments: url.pathname.split('/').filter(Boolean)
        });
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments as any);
        const url = new URL(arguments[2] as string, window.location.origin);
        globalUnresolvedRoute.set({
            path: url.pathname,
            segments: url.pathname.split('/').filter(Boolean)
        });
    };
}

export function navigate(path: string) {
    const url = new URL(path, window.location.origin);
    globalUnresolvedRoute.set({
        path: url.pathname,
        segments: url.pathname.split('/').filter(Boolean)
    });
    history.pushState(null, "", path);
}
