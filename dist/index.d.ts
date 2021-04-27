import Router from './Router.svelte';
export declare let currRoute: Route;
export declare function link(node: HTMLAnchorElement, data?: any): {
    destroy(): void;
};
export declare function route(node: HTMLElement, route: Omit<RouteChange, 'changeState'> | string): {
    destroy(): void;
};
export declare function goTo(route: Omit<RouteChange, 'changeState'> | string, changeState?: ChangeState): void;
export declare function goNext(): void;
export declare function goPrev(): void;
declare type RouteChange = {
    key: string;
    data?: any;
    changeState?: ChangeState;
};
declare type ChangeState = 'push' | 'replace';
export declare type Route = {
    path: string;
    comp: any;
    title: string;
    data?: any;
    restrictions?: Array<string>;
    disableSlot?: boolean;
};
export declare type Routes = {
    [key: string]: Omit<Route, 'data'>;
};
/**
 * Returns false for when the route is let through (not restricted), and
 * false, or route key to redirect to when restricted.
 */
export declare type RestrictionResolver = (route: Route) => false | string;
export declare type RouterConf = {
    routes: Routes;
    onRouteChanged: (route: Route) => void;
    rewriteInvalid: boolean;
    onInvalidRoute?: string;
    restrictions?: {
        [restriction: string]: RestrictionResolver;
    };
};
export declare function isRouteRestricted(route: Route): false | string;
export declare function createRouter(conf: RouterConf): Route;
export { Router, };
export default link;
