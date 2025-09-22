import {match} from "path-to-regexp";
import {derived, type Readable, type Writable} from 'svelte/store';
import type {
  MatchedRoute,
  RouteParams,
  Routes,
  RoutesImpl,
  ResolvedRouteComponent,
  RouteDefinition,
  ErroneousRouteStore, ResolvedRouteStore
} from "./types";
import {resolvedRoute} from "./store";

function setResolvedRoute(path: string, state?: any, search?: string): void {
  resolvedRoute.set({
    path,
    segments: path.split('/').filter(Boolean),
    state,
    search: search || window.location.search
  });
}

function setUnresolvedStore(store: Writable<ResolvedRouteStore | null> | undefined, remaining: string[], state?: any): void {
  store?.set({
    path: remaining.length > 0 ? '/' + remaining.join('/') : '/',
    segments: remaining,
    state
  });
}

function createMatchedRoute(params: RouteParams, name: string, component: any, guard?: any): MatchedRoute {
  return {
    params,
    name,
    component,
    guard
  };
}

async function loadComponent(component: () => Promise<any>, params: RouteParams, state: any, name: string, hasRemaining: boolean, set: any, cachedName: string | null, cachedComponent: any, search?: string): Promise<{name: string, component: any}> {
  try {
    const module = await component();
    const searchParams = !hasRemaining && search ? Object.fromEntries(new URLSearchParams(search)) : undefined;
    set({
      component: module.default,
      props: {
        route: {
          params,
          state,
          search: searchParams
        }
      },
      name,
      loading: false,
      hasRemaining
    });
    return {name, component: module.default};
  } catch {
    set({
      component: null,
      props: null,
      name: '__error',
      loading: false,
      hasRemaining: false
    });
    return {name: '', component: null};
  }
}

export class Config {
  static routes: RoutesImpl
  static currentPath: string
  static isInitialized: boolean = false
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
          matched: createMatchedRoute({}, '/', routeData),
          remaining: []
        };
      } else if ("name" in routeData && "component" in routeData) {
        return {
          matched: createMatchedRoute({}, routeData.name, routeData.component, routeData.guard),
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
            matched: createMatchedRoute(result.params as RouteParams, routePath, routeData),
            remaining
          };
        } else if ("name" in routeData && "component" in routeData) {
          return {
            matched: createMatchedRoute(result.params as RouteParams, routeData.name, routeData.component, routeData.guard),
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


export function initRouter(parentRoute: string | undefined, routes: Routes): void {
  if (typeof window === 'undefined') return;

  validateRoutes(routes);
  const processedRoutes = convertRoutesToRouteData(routes, parentRoute);
  appendToConfigRoutes(processedRoutes, parentRoute);

  if (Config.isInitialized) {
    return;
  }

  Config.isInitialized = true;
  
  window.addEventListener("popstate", (event) => {
    setResolvedRoute(window.location.pathname, event.state, window.location.search);
  });

  document.body.addEventListener("click", (e) => {
    const anchor = (e.target as HTMLElement).closest('a');
    if (
      anchor &&
      anchor.href &&
      anchor.href.startsWith(window.location.origin)
    ) {
      e.preventDefault();
      const url = new URL(anchor.href);
      setResolvedRoute(url.pathname, null, url.search);
      history.pushState(null, "", anchor.href);
    }
  });
}

export function createRouteResolver(resolveStore: Readable<ResolvedRouteStore | null>, routes: Routes, unresolvedStore?: Writable<ResolvedRouteStore | null>): Readable<ResolvedRouteComponent> {
  let cachedName: string | null = null;
  let cachedComponent: any = null;
  
  return derived(resolveStore, (store, set) => {
    if (!store) {
      set({ component: null, props: null, name: '', loading: false, hasRemaining: false });
      return;
    }
    
    const result = resolveRoute(store.segments, routes);
    
    if (result.matched) {
      const {component, params, name, guard} = result.matched;
      
      const hasCachedComponent = cachedName === name && cachedComponent;
      
      if (guard) {
        (async () => {
          try {
            const guardResult = await guard();
            
            if (guardResult) {
              cachedName = null;
              cachedComponent = null;
              
              if (typeof guardResult === 'string') {
                history.replaceState(null, "", guardResult);
                setResolvedRoute(guardResult);
              } else if (guardResult && typeof guardResult === 'object' && 'path' in guardResult) {
                history.replaceState(guardResult.state || null, "", guardResult.path);
                setResolvedRoute(guardResult.path, guardResult.state);
              }
              return;
            }
            
            if (hasCachedComponent) {
              setUnresolvedStore(unresolvedStore, result.remaining, store.state);
              
              set({
                component: cachedComponent,
                props: {
                  route: {
                    params,
                    state: store.state,
                    search: !result.remaining.length && store.search ? Object.fromEntries(new URLSearchParams(store.search)) : undefined
                  }
                },
                name,
                loading: false,
                hasRemaining: result.remaining.length > 0
              });
            } else {
              set({ component: null, props: null, name: '', loading: true, hasRemaining: result.remaining.length > 0 });
              
              setUnresolvedStore(unresolvedStore, result.remaining, store.state);
              
              const loaded = await loadComponent(component, params, store.state, name, result.remaining.length > 0, set, cachedName, cachedComponent, store.search);
              cachedName = loaded.name;
              cachedComponent = loaded.component;
            }
          } catch {
            cachedName = null;
            cachedComponent = null;
            set({
              component: null,
              props: null,
              name: '__error',
              loading: false,
              hasRemaining: false
            });
          }
        })();
      } else if (hasCachedComponent) {
        setUnresolvedStore(unresolvedStore, result.remaining, store.state);
        
        set({
          component: cachedComponent,
          props: {
            route: {
              params,
              state: store.state,
              search: !result.remaining.length && store.search ? Object.fromEntries(new URLSearchParams(store.search)) : undefined
            }
          },
          name,
          loading: false,
          hasRemaining: result.remaining.length > 0
        });
      } else {
        set({ component: null, props: null, name: '', loading: true, hasRemaining: result.remaining.length > 0 });
        
        (async () => {
          setUnresolvedStore(unresolvedStore, result.remaining, store.state);
          
          const loaded = await loadComponent(component, params, store.state, name, result.remaining.length > 0, set, cachedName, cachedComponent, store.search);
          cachedName = loaded.name;
          cachedComponent = loaded.component;
        })();
      }
    } else {
      cachedName = null;
      cachedComponent = null;
      set({
        component: null,
        props: null,
        name: '__not_found',
        loading: false,
        hasRemaining: false
      });
    }
  }, { component: null, props: null, name: '', loading: true, hasRemaining: false } as ResolvedRouteComponent);
}

export function createErrorHandler(errorStore: Readable<ErroneousRouteStore>, fallback?: RouteDefinition): Readable<ResolvedRouteComponent> {
  return derived(errorStore, (store, set) => {
    if (!store || !fallback) {
      set({ component: null, props: null, name: '', loading: false, hasRemaining: false } as ResolvedRouteComponent);
      return;
    }

    set({ component: null, props: null, name: '__fallback', loading: true, hasRemaining: false } as ResolvedRouteComponent);

    if (typeof fallback === 'function') {
      fallback().then((module: any) => {
        set({
          component: module.default,
          props: {
            route: {
              error: store,
            }
          },
          name: '__fallback',
          loading: false,
          hasRemaining: false
        });
      });
    } else if (typeof fallback === 'string') {
      set({ component: null, props: null, name: '__redirect', loading: false, hasRemaining: false } as ResolvedRouteComponent);
    } else if ("component" in fallback) {
      fallback.component().then((module: any) => {
        set({
          component: module.default,
          props: {
            route: {
              error: store,
            }
          },
          name: '__fallback',
          loading: false,
          hasRemaining: false
        });
      });
    }
  }, { component: null, props: null, name: '', loading: false, hasRemaining: false } as ResolvedRouteComponent);
}

export function navigate(path: string, state?: any) {
  const url = new URL(path, window.location.origin);
  Config.currentPath = url.pathname;
  setResolvedRoute(url.pathname, state, url.search);
  history.pushState(state || null, "", path);
}
