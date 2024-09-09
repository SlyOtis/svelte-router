/** Represents route parameters as key-value pairs */
export type RouteParams = {
  [key: string]: string;
};

/** Represents a lazy-loaded route component */
export type RouteComponent = () => Promise<any>;

/** Contains all information about the current route */
export type RouteInfo<T = any> = {
  name: string;
  pathname: string;
  search: string;
  hash: string;
  state: T;
  queryParams: Map<string, string>;
  params: RouteParams;
  component: RouteComponent | null;
};

/** RouteProps without the component property */
export type RouteProps<T = any> = Omit<RouteInfo<T>, "component">;

export type RouteData = { name: string; component: RouteComponent }

/** Defines the structure of routes configuration */
export type Routes = Record<
  string,
  RouteData | RouteComponent
>;
