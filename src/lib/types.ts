export type RouteParams = {
    [key: string]: string;
}

export type RouteComponent = () => Promise<any>

export type RouteInfo<T = any> = {
    pathname: string;
    search: string;
    hash: string;
    state: T;
    queryParams: Map<string, string>;
    params: RouteParams;
    component: RouteComponent | null;
}

export type Routes = Record<string, RouteComponent>;