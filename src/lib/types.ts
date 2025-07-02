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
 * Represents a named route with its associated component
 * @property name - The name of the route
 * @property component - The lazy-loaded component for this route
 */
export type RouteData = { name: string; component: RouteComponent };

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