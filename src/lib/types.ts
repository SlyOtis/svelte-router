import type { Router } from "./index";

/** Represents route parameters as key-value pairs */
export type RouteParams = {
  [key: string]: string;
};

/**
 * Represents a lazy-loaded route component
 * @returns A promise resolving to the component
 */
export type RouteComponent = () => Promise<any>;
export type SvelteRouterComponent = typeof Router;

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
 * Represents a matched route in the router
 */
export type MatchedLocationRoute = {
  /** Route parameters extracted from the URL */
  params: RouteParams;
  /** The name of the matched route */
  name: string;
  /** The lazy-loaded component associated with the route */
  component: () => Promise<any>;
  /** Che current URL of the matched route */
  url: URL
};
