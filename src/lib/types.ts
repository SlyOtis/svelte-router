/** Represents route parameters as key-value pairs */
export type RouteParams = {
  [key: string]: string;
};

/**
 * Represents a lazy-loaded route component
 * @returns A promise resolving to the component
 */
export type RouteComponent = () => Promise<any>;

/**
 * Represents a route guard function that determines if navigation should proceed
 * @returns A promise resolving to either:
 *          - null: Allow navigation to proceed
 *          - string: Redirect to the returned path
 */
export type RouteGuard = () => Promise<string | null>;

/**
 * Represents a named route with its associated component
 * @property name - The name of the route
 * @property component - The lazy-loaded component for this route
 */
export type RouteData = { name: string; component: RouteComponent, guard?: RouteGuard };

/**
 * Extended RouteData for internal router implementation
 */
export type RouteDataWithParent = RouteData & { parentRoute: string };

/**
 * Internal routes implementation type
 */
export type RoutesImpl = Record<string, RouteDataWithParent | string>;

/**
 * Represents the possible definitions for a route
 *
 * Can be one of:
 * - RouteData: An object with 'name' and 'component' properties
 * - RouteComponent: A function returning a Promise that resolves to a component
 * - string: A pathname string for redirection
 */
export type RouteDefinition = RouteData | RouteComponent | string;

/**
 * Defines the structure of routes configuration
 * Keys are route paths, values are either RouteData, RouteComponent, or a redirect pathname
 */
export type Routes = Record<string, RouteDefinition>;

/**
 * Represents a matched route in the router
 */
export type MatchedRoute = {
  /** Route parameters extracted from the URL */
  params: RouteParams;
  /** The name of the matched route */
  name: string;
  /** The lazy-loaded component associated with the route */
  component: () => Promise<any>;
};

/**
 * Represents the router context passed between nested routers
 */
export type RouterContext = {
  resolveStore: import('svelte/store').Writable<{ path: string, segments: string[] } | null>;
  errorStore: import('svelte/store').Writable<{ error: string, path: string } | null>;
  isRoot: boolean;
  parentRoute?: string;
};

/**
 * Store types
 */
export type ResolvedRouteStore = {
  path: string;
  segments: string[];
};

export type ErroneousRouteStore = {
  error: string;
  unresolvedPath: string;
} | null;

export type CurrentRouteStore = {
  path: string;
  params: RouteParams;
  parentPath: string;
};

/**
 * Represents a resolved route component after loading
 */
export type ResolvedRouteComponent = {
  component: any | null;
  props: any | null;
  name: string;
  loading: boolean;
};

/**
 * Represents an unresolved route that needs to be processed
 */
export type UnresolvedRoute = {
  path: string;
  segments: string[];
};