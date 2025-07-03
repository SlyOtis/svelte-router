import type {Writable} from "svelte/store";

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
 *          - null/undefined: Allow navigation to proceed
 *          - string: Redirect to the returned path
 *          - object: Redirect with path and state { path: string, state?: any }
 */
export type RouteGuard = () => Promise<string | null | undefined | { path: string, state?: any }>;

/**
 * Represents a named route with its associated component
 * @property name - The name of the route
 * @property component - The lazy-loaded component for this route
 * @property guard - Optional guard function for route protection
 */
export type RouteData = { name: string; component: RouteComponent, guard?: RouteGuard };

/**
 * Extended RouteData for internal router implementation
 * @property parentRoute - The parent route path for nested routing
 */
export type RouteDataWithParent = RouteData & { parentRoute: string };

/**
 * Internal routes implementation type
 * Maps route patterns to RouteDataWithParent objects or redirect strings
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
  /** Optional guard function for route protection */
  guard?: RouteGuard;
};

/**
 * Represents the router context passed between nested routers
 */
export type RouterContext = {
  /** Store for tracking unresolved route data */
  resolveStore: Writable<ResolvedRouteStore | null>;
  /** Store for tracking routing errors */
  errorStore: Writable<ErroneousRouteStore | null>;
  /** Whether this is the root router instance */
  isRoot: boolean;
  /** The parent route path for nested routing */
  parentRoute?: string;
};

/**
 * Represents the current resolved route state
 */
export type ResolvedRouteStore = {
  /** The current route path */
  path: string;
  /** Path segments split by '/' */
  segments: string[];
  /** Optional state data passed with navigation */
  state?: any;
};

/**
 * Props passed to route components
 * All route components receive these props in a 'router' prop
 */
export interface RouteProps {
  /** Route parameters extracted from the URL pattern */
  params?: RouteParams
  /** Error information if the route is rendered as a fallback */
  error?: ErroneousRouteStore
  /** State data passed during navigation or from guards */
  state?: any
}

/**
 * Represents an error state in routing
 */
export type ErroneousRouteStore = {
  /** The error message */
  error: string;
  /** The path that caused the error */
  path: string;
} | null;

/**
 * Represents the current active route information
 */
export type CurrentRouteStore = {
  /** The current route path */
  path: string;
  /** Route parameters extracted from the URL */
  params: RouteParams;
  /** The parent route path */
  parentPath: string;
};

/**
 * Represents a resolved route component after loading
 */
export type ResolvedRouteComponent = {
  /** The loaded component (null if not loaded or error) */
  component: any | null;
  /** Props to pass to the component, wrapped in a 'router' property */
  props: { route: RouteProps } | null;
  /** The route name or special identifier (__error, __not_found, etc.) */
  name: string;
  /** Whether the component is currently loading */
  loading: boolean;
};