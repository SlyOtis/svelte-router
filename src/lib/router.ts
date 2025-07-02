import {match} from "path-to-regexp";
import {writable, readable, derived, type Readable} from 'svelte/store';
import type {MatchedRoute, RouteData, RouteParams, Routes, RoutesImpl, ResolvedRouteComponent, UnresolvedRoute, RouteDefinition} from "./types";
import {resolvedRoute} from "./store";


export class Config {
  static routes: RoutesImpl
  static currentPath: string
}

function isValidRoutePattern(pattern: string): boolean {
  if (!pattern) return false;
  if (pattern === '/') return true;

  try {
    match(pattern, {decode: decodeURIComponent});
    return true;
  } catch {
    return false;
  }
}

function validateRoutes(routes: Routes): void {
  for (const [pattern] of Object.entries(routes)) {
    if (!isValidRoutePattern(pattern)) {
      throw new Error(`Invalid route pattern: ${pattern}`);
    }
  }
}

function convertRoutesToRouteData(routes: Routes, parentRoute?: string): RoutesImpl {
  const result: RoutesImpl = {};
  let expressionCounter = 1;
  
  for (const [pattern, routeDefinition] of Object.entries(routes)) {
    if (typeof routeDefinition === 'string') {
      result[pattern] = routeDefinition;
    } else {
      const segments = pattern.split('/').filter(Boolean);
      let routeName: string;
      
      if (segments.length === 0) {
        routeName = 'index';
      } else {
        const firstSegment = segments[0];
        if (/^[a-zA-Z0-9_-]+$/.test(firstSegment)) {
          routeName = firstSegment;
        } else {
          routeName = `expression${expressionCounter++}`;
        }
      }
      
      if (typeof routeDefinition === 'function') {
        result[pattern] = {
          name: routeName,
          component: routeDefinition,
          parentRoute: parentRoute || ''
        };
      } else {
        result[pattern] = {
          ...routeDefinition,
          name: routeDefinition.name || routeName,
          parentRoute: parentRoute || ''
        };
      }
    }
  }
  
  return result;
}

function appendToConfigRoutes(processedRoutes: RoutesImpl, parentRoute?: string): void {
  if (!Config.routes) {
    Config.routes = processedRoutes;
  } else {
    for (const [pattern, routeData] of Object.entries(processedRoutes)) {
      if (typeof routeData !== 'string' && parentRoute) {
        routeData.parentRoute = parentRoute;
      }
      Config.routes[pattern] = routeData;
    }
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


export function initRouter(parentRoute: string | undefined, routes: Routes): string {
  if (typeof window === 'undefined') return '';

  validateRoutes(routes);
  const processedRoutes = convertRoutesToRouteData(routes, parentRoute);
  appendToConfigRoutes(processedRoutes, parentRoute);

  const currentPath = window.location.pathname;
  resolvedRoute.set({
    path: currentPath,
    segments: currentPath.split('/').filter(Boolean)
  });

  window.addEventListener("popstate", (event) => {
    resolvedRoute.set({
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
      resolvedRoute.set({
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
    resolvedRoute.set({
      path: url.pathname,
      segments: url.pathname.split('/').filter(Boolean)
    });
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function () {
    originalReplaceState.apply(this, arguments as any);
    const url = new URL(arguments[2] as string, window.location.origin);
    resolvedRoute.set({
      path: url.pathname,
      segments: url.pathname.split('/').filter(Boolean)
    });
  };
  
  return currentPath;
}

export function createRouteResolver(resolveStore: Readable<UnresolvedRoute | null>, routes: Routes): Readable<ResolvedRouteComponent> {
  return derived(resolveStore, (store, set) => {
    if (!store) {
      set({ component: null, props: null, name: '', loading: true });
      return;
    }
    
    const result = resolveRoute(store.segments, routes);

    if (result.matched) {
      const {component, params, name} = result.matched;
      
      component().then((module: any) => {
        set({
          component: module.default,
          props: {params},
          name,
          loading: false
        });
      }).catch(() => {
        set({
          component: null,
          props: null,
          name: '__error',
          loading: false
        });
      });
    } else {
      set({
        component: null,
        props: null,
        name: '__not_found',
        loading: false
      });
    }
  }, { component: null, props: null, name: '', loading: true } as ResolvedRouteComponent);
}

export function createErrorHandler(errorStore: Readable<{error: string, path: string} | null>, fallback?: RouteDefinition): Readable<ResolvedRouteComponent> {
  return derived(errorStore, (store, set) => {
    if (!store || !fallback) {
      set({ component: null, props: null, name: '', loading: false } as ResolvedRouteComponent);
      return;
    }

    set({ component: null, props: null, name: '__fallback', loading: true } as ResolvedRouteComponent);

    if (typeof fallback === 'function') {
      fallback().then((module: any) => {
        set({
          component: module.default,
          props: null,
          name: '__fallback',
          loading: false
        });
      });
    } else if (typeof fallback === 'string') {
      set({ component: null, props: null, name: '__redirect', loading: false } as ResolvedRouteComponent);
    } else if ("component" in fallback) {
      fallback.component().then((module: any) => {
        set({
          component: module.default,
          props: null,
          name: '__fallback',
          loading: false
        });
      });
    }
  }, { component: null, props: null, name: '', loading: false } as ResolvedRouteComponent);
}

export function navigate(path: string) {
  const url = new URL(path, window.location.origin);
  Config.currentPath = url.pathname;
  resolvedRoute.set({
    path: url.pathname,
    segments: url.pathname.split('/').filter(Boolean)
  });
  history.pushState(null, "", path);
}
