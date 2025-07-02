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

export function resolveRoute(segments: string[], routes: Routes): {
    matched: MatchedRoute | null;
    remaining: string[];
} {
    console.log('🔧 resolveRoute called with segments:', segments, 'routes:', Object.keys(routes));
    
    if (segments.length === 0) {
        console.log('📭 No segments - checking for root route "/"');
        if (routes['/']) {
            const routeData = routes['/'];
            console.log('🎯 Root route found');
            if (typeof routeData === 'string') {
                console.log('🔄 Root redirect to:', routeData);
                const redirectSegments = routeData.split('/').filter(Boolean);
                return resolveRoute(redirectSegments, routes);
            } else if (typeof routeData === 'function') {
                console.log('🎯 Root function route matched');
                return {
                    matched: {
                        params: {},
                        name: '/',
                        component: routeData,
                    },
                    remaining: []
                };
            } else if ("name" in routeData && "component" in routeData) {
                console.log('🎯 Root named route matched');
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

    const sortedRouteKeys = Object.keys(routes).sort((a, b) => {
        // First, sort by total path length (longer paths first)
        if (a.length !== b.length) {
            return b.length - a.length;
        }
        
        // Then by number of segments (more segments first)
        const segmentsA = a.split('/').filter(Boolean);
        const segmentsB = b.split('/').filter(Boolean);
        if (segmentsA.length !== segmentsB.length) {
            return segmentsB.length - segmentsA.length;
        }
        
        // Finally, prioritize static segments over dynamic ones
        for (let i = 0; i < Math.min(segmentsA.length, segmentsB.length); i++) {
            const isParamA = segmentsA[i].startsWith(':');
            const isParamB = segmentsB[i].startsWith(':');
            if (isParamA !== isParamB) {
                return isParamA ? 1 : -1; // Static routes before param routes
            }
        }
        
        return 0;
    });

    console.log('📋 Sorted route keys:', sortedRouteKeys);

    for (const routePath of sortedRouteKeys) {
        console.log('🔍 Testing route:', routePath);
        const routeSegments = routePath.split('/').filter(Boolean);
        
        // Try to match as many segments as possible, but don't require exact length match
        // We'll test with the minimum between route segments and available segments
        const segmentsToTest = Math.min(routeSegments.length, segments.length);
        
        // Skip if route has more segments than we can possibly match
        if (routeSegments.length > segments.length) {
            console.log('⏭️ Route has more segments than available, skipping');
            continue;
        }
        
        const testPath = routeSegments.length === 0 ? '/' : '/' + segments.slice(0, routeSegments.length).join('/');
        console.log('🧪 Testing path:', testPath, 'against pattern:', routePath);
        
        const matchFn = match(routePath, {decode: decodeURIComponent});
        const result = matchFn(testPath);
        
        if (result) {
            console.log('✅ Route matched:', routePath, 'with params:', result.params);
            const routeData = routes[routePath];
            const remaining = segments.slice(routeSegments.length);
            console.log('📦 Route data type:', typeof routeData, 'remaining segments:', remaining);
            
            if (typeof routeData === 'string') {
                console.log('🔄 Redirect to:', routeData);
                const redirectSegments = routeData.split('/').filter(Boolean);
                return resolveRoute([...redirectSegments, ...remaining], routes);
            } else if (typeof routeData === 'function') {
                console.log('🎯 Function route matched');
                return {
                    matched: {
                        params: result.params as RouteParams,
                        name: routePath,
                        component: routeData,
                    },
                    remaining
                };
            } else if ("name" in routeData && "component" in routeData) {
                console.log('🎯 Named route matched');
                return {
                    matched: {
                        params: result.params as RouteParams,
                        name: routeData.name,
                        component: routeData.component,
                    },
                    remaining
                };
            }
        } else {
            console.log('❌ No match for:', testPath);
        }
    }
    
    console.log('💥 No routes matched');
    return {matched: null, remaining: segments};
}


export function initRouter() {
    if (typeof window === 'undefined') return;
    
    console.log('🌍 Router initialized for:', window.location.pathname);
    
    globalUnresolvedRoute.set({
        path: window.location.pathname,
        segments: window.location.pathname.split('/').filter(Boolean)
    });

    window.addEventListener("popstate", (event) => {
        console.log('⬅️ Popstate event:', window.location.pathname);
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
            console.log('🔗 Link clicked:', target.href);
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
        console.log('📤 Push state:', arguments[2]);
        const url = new URL(arguments[2] as string, window.location.origin);
        globalUnresolvedRoute.set({
            path: url.pathname,
            segments: url.pathname.split('/').filter(Boolean)
        });
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments as any);
        console.log('🔄 Replace state:', arguments[2]);
        const url = new URL(arguments[2] as string, window.location.origin);
        globalUnresolvedRoute.set({
            path: url.pathname,
            segments: url.pathname.split('/').filter(Boolean)
        });
    };
}

export function navigate(path: string) {
    console.log('🧭 Navigate to:', path);
    const url = new URL(path, window.location.origin);
    globalUnresolvedRoute.set({
        path: url.pathname,
        segments: url.pathname.split('/').filter(Boolean)
    });
    history.pushState(null, "", path);
}
