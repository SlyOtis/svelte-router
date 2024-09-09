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
 * Contains all information about the current route
 * @template T - Type of the route state
 */
export type RouteInfo<T = any> = {
  /** The name of the route */
  name: string;
  /** The pathname of the current URL */
  pathname: string;
  /** The search (query) part of the URL */
  search: string;
  /** The hash part of the URL */
  hash: string;
  /** Custom state associated with the route */
  state: T;
  /** Map of query parameters */
  queryParams: Map<string, string>;
  /** Object containing route parameters */
  params: RouteParams;
  /** The lazy-loaded component for this route, or null */
  component: RouteComponent | null;
};

/**
 * RouteProps without the component property
 * @template T - Type of the route state
 */
export type RouteProps<T = any> = Omit<RouteInfo<T>, "component">;

/**
 * Represents a named route with its associated component
 * @property name - The name of the route
 * @property component - The lazy-loaded component for this route
 */
export type RouteData = { name: string; component: RouteComponent };

/**
 * Defines the structure of routes configuration
 * Keys are route paths, values are either RouteData or RouteComponent
 */
export type Routes = Record<string, RouteData | RouteComponent>
